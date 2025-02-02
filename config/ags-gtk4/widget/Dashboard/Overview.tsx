import { App, Astal, Gtk, Gdk, hook } from "astal/gtk4";
import PopupWindow from "../../common/PopupWindow";
import { Variable, bind } from "astal";
import { range, lookUpIcon, toggleWindow } from "../../lib/utils";
import AstalHyprland from "gi://AstalHyprland?version=0.1";
import icons, { substitutions } from "../../lib/icons";
// import cairo from "gi://cairo?version=1.0";
import cairo from 'cairo';
import GLib from "gi://GLib?version=2.0";
import Gio from "gi://Gio?version=2.0";

const Hyprland = AstalHyprland.get_default();
export const ws = Variable<number>(10);
const SCALE = 0.08;
// const TARGET = [Gtk.TargetEntry.new('text/plain', Gtk.TargetFlags.SAME_APP, 0)];//TOODfix do not need?
const WORKSPACE_MIME_TYPE = "text/plain";
export const namespace = "overview";

Gio._promisify(Gdk.Drop.prototype, "read_async", "read_finish");
Gio._promisify(Gio.InputStream.prototype, "read_bytes_async", "read_bytes_finish");

function getHyprlandClientIcon(client: string) {
	if (!client) return icons.fallback.executable;

	let icon = "";

	icon = substitutions.icons[client] || icon;

    if (icon) {
        return icon;
    }

	console.log("Please add the following to the substitutions icons:", client);//TODOfix check if this is correct thing to do?
	return client;
};

/**
  * @param {import('gi://Gtk?version=3.0').default.Widget} widget
  * @returns {any} - missing cairo type
  */
export function createSurfaceFromWidget(widget) {
    const alloc = widget.get_allocation()
    const surface = new cairo.ImageSurface(
        cairo.Format.ARGB32,
        alloc.width,
        alloc.height,
    )
    const cr = new cairo.Context(surface)
    cr.setSourceRGBA(255, 255, 255, 0)
    cr.rectangle(0, 0, alloc.width, alloc.height)
    cr.fill()
    widget.draw(cr)
    return surface
}

const focus = (address: string) => Hyprland.dispatch("focuswindow", `address:${address}`);
const close = (address: string) => Hyprland.dispatch("closewindow", `address:${address}`);

const Client = ({ address, size: [w, h], class: c, title }) => {
	// Buttons break after getting drag'n'dropped. So make a fake button out of a box instead
	// The active class is updated later by the workspace wrapper.
	const button = (
		<box
			name={`client`}
			cssClasses={["client"]}
			hexpand={true}
			onButtonReleased={(_, event) => {
				if (!address) {
					return;
				}

				switch (event.get_button()) {
					case Gdk.BUTTON_PRIMARY:
						focus(address);
						return;
						// return toggleWindow(namespace); //TODOfix does not work
					case Gdk.BUTTON_SECONDARY:
						return close(address);
					case Gdk.BUTTON_MIDDLE:
						return close(address);
				}
			}}
		>
			<image
				iconName={getHyprlandClientIcon(c)}
				cssClasses={[`img${w}${h}`]}
				setup={() => {
					const minWidth = w * (SCALE - 0.001);
					const minHeight = h * (SCALE - 0.001);
					if (minWidth && minHeight) {
						App.apply_css(`.img${w}${h} {
							min-width: ${minWidth}px;
							min-height: ${minHeight}px;
						}`, false);
					}
				}}
			/>
		</box>
	);

    const dragSource = new Gtk.DragSource();
    dragSource.connect("prepare", () => {
        console.log("prepare");
		// Use GLib.Bytes to represent the address as a byte array
		const addressBytes = new GLib.Bytes(address);
	
		// Provide the bytes as drag content
		return Gdk.ContentProvider.new_for_bytes("application/x-text", addressBytes);
    });
    dragSource.connect("drag-begin", (source) => {
        console.log("drag-begin");
        button.add_css_class("dragging");
        source.set_icon(new Gtk.WidgetPaintable({ widget: button }), 0, 0);
    });
    dragSource.connect("drag-end", () => {
        console.log("drag-end");
        button.remove_css_class("dragging");
    });
    dragSource.connect("drag-cancel", () => {
        console.log("drag-cancel");
        button.remove_css_class("dragging");
    });

    button.add_controller(dragSource);

    return button;
};

const Workspace = (index: number) => {
    const fixed = new Gtk.Fixed;

	const workspace = (index: number) => Hyprland.dispatch("workspace", `${index}`);
	const movetoworkspacesilent = (workspace: number, address: string) =>
		Hyprland.dispatch("movetoworkspacesilent", `${workspace}, address:${address}`);

	return (
		<box
			cssClasses={bind(Hyprland, 'clients').as((clientList) => {
				for (const client of clientList) {
					if (client.workspace && client.workspace.id === index)
						return ["active", "workspace"];
				}
				return ["workspace"];
			})}
			halign={Gtk.Align.CENTER}
			id={index}
			attribute={(clients) => {
                // Clear previous children and add the new ones
				for (const fix of fixed) {
					fix.unparent();
				}

				clients
					.filter(({ workspace: { id }}) => id === index)
					.forEach(c => {
						c.at[0] -= Hyprland.get_monitor(c.monitor)?.x || 0;
						c.at[1] -= Hyprland.get_monitor(c.monitor)?.y || 0;
						c.mapped && fixed.put(Client(c), c.at[0] * SCALE, c.at[1] * SCALE);
					});
	
				fixed.show();
			}}
			setup={(self) => {
				const dropTarget = new Gtk.DropTargetAsync({
					actions: Gdk.DragAction.COPY,
					formats: new Gdk.ContentFormats(["application/x-text"]),
				});
			
				dropTarget.connect("drop", (self, drop) => {
					drop.read_async(["application/x-text"], GLib.PRIORITY_DEFAULT, null)
						.then(([stream]) => stream?.read_bytes_async(1024, GLib.PRIORITY_DEFAULT, null))
						.then((bytes) => {
							const address = new TextDecoder().decode(bytes.get_data());
							console.log(`Dropped address: ${address}`);
							// Move the client to the workspace
							Hyprland.dispatch("movetoworkspacesilent", `${index}, address:${address}`);
						})
						.catch(console.error);
			
					drop.finish(Gdk.DragAction.COPY);
					return true;
				});

				self.add_controller(dropTarget);

				const minWidth = Hyprland.get_focused_monitor().width * SCALE;
				const minHeight = Hyprland.get_focused_monitor().height * SCALE;
				if (minWidth && minHeight) {
					App.apply_css(`.workspace { min-width: ${minWidth}px; min-height: ${minHeight}px; }`, false);
				}
			}}
		>
			<box
				cssClasses={["eventbox"]}
				hexpand
				vexpand
				onButtonPressed={() => {
					workspace(index)
				}}
			>
				{fixed}
			</box>
		</box>
	)
}

const update = (box) => {
	if (!box.get_parent()?.visible)
        return;

	Hyprland.message_async("j/clients", (_, res) => {
		const clients = Hyprland.message_finish(res);

		if (!clients)
			return
	
		box.children.forEach(ws => {
			ws.attribute(JSON.parse(clients));
		});
	})
};

const children = (box) => {
    if (ws.get() === 0) {
        box.children = Hyprland.get_workspaces()
            .sort((ws1, ws2) => ws1.id - ws2.id)
            .map(({ id }) => Workspace(id));
    }
};

const Overview = () => (
	<box
		cssClasses={[namespace]}
		setup={(self) => {
			hook(self, Hyprland, "event", () => {
				self.children = range(10).map(Workspace);
				update(self);
				children(self);

				self.children.map(box => {
					box.visible = Hyprland.workspaces.some(workspace => {
						if (workspace.id < 10)
							return workspace.id +1 >= box.id

						return workspace.id >= box.id
					});
				});
			});

			hook(self, Hyprland, "notify::workspaces", () => {
				children(self)
			})

			update(self);
			children(self);
		}}
	>
	</box>
);
export default () => {
	return (
		<PopupWindow
			name={namespace}
			namespace={namespace}
			scrimType="transparent"
			anchor={Astal.WindowAnchor.TOP}
			marginTop={12}
			layer={Astal.Layer.OVERLAY}
			exclusivity={Astal.Exclusivity.NORMAL}
			keymode={Astal.Keymode.EXCLUSIVE}
			onKeyPressed={(_, keyval) => {
				if (keyval === Gdk.KEY_Escape) {
					App.toggle_window(namespace);
				}
			}}
		>
			{Overview()}
		</PopupWindow>
	);
};
