import { App, Astal, Gtk, Gdk } from "astal/gtk3";
import PopupWindow from "../../common/PopupWindow";
import { Variable, bind } from "astal";
import { range, lookUpIcon, toggleWindow } from "../../lib/utils";
import AstalHyprland from "gi://AstalHyprland?version=0.1";
import icons, { substitutions } from "../../lib/icons";
import { getHyprlandClientIcon } from "../Bar/items/Taskbar";
// import cairo from "gi://cairo?version=1.0";
import cairo from 'cairo';

const Hyprland = AstalHyprland.get_default();
export const ws = Variable<number>(10);
const SCALE = 0.08;
const TARGET = [Gtk.TargetEntry.new('text/plain', Gtk.TargetFlags.SAME_APP, 0)];
export const namespace = "overview";

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

const Client = ({ address, size: [w, h], class: c, title }) => (
	<button
		className={"client"}
		tooltipText={`${title}`}
		onClickRelease={(self, event) => {
			if (!address) {
				return;
			}

			switch (event.button) {
				case Gdk.BUTTON_PRIMARY:
					focus(address)
					return toggleWindow(namespace);
				case Gdk.BUTTON_SECONDARY:
					return close(address);
				case Gdk.BUTTON_MIDDLE:
					return close(address);
			}
		}}
		setup={(btn) => {
			btn.hook(btn, "drag-data-get", (_w, _c, data) => data.set_text(address, address.length))
			.hook(btn, "drag-begin", (_, context) => {
				Gtk.drag_set_icon_surface(context, createSurfaceFromWidget(btn));
				btn.toggleClassName('hidden', true);
			})
			.hook(btn, "drag-end", () => btn.toggleClassName('hidden', false))
			.drag_source_set(Gdk.ModifierType.BUTTON1_MASK, TARGET, Gdk.DragAction.COPY);
		}}
	>
		<icon
			css={`
				min-width: ${w * SCALE}px;
            	min-height: ${h * SCALE}px;
			`}
			setup={(self) => {
				const icon = substitutions.icons[c]
					? substitutions.icons[c]
					: lookUpIcon(c)
						? c
						: icons.fallback.executable;

				self.set_icon(getHyprlandClientIcon(c, icon));
			}}
		/>
	</button>
);

const Workspace = (index: number) => {
    const fixed = Gtk.Fixed.new();

	const workspace = (index: number) => Hyprland.dispatch("workspace", `${index}`);
	const movetoworkspacesilent = (workspace: number, address: string) =>
		Hyprland.dispatch("movetoworkspacesilent", `${workspace}, address:${address}`);

	return (
		<box
			className={bind(Hyprland, 'clients').as((clientList) => {
				for (const client of clientList) {
					if (client.workspace && client.workspace.id === index)
						return "active workspace";
				}
				return "workspace";
			})}
			halign={Gtk.Align.CENTER}
			css={`
				min-width: ${3840 * SCALE}px;
            	min-height: ${2160 * SCALE}px;
			`}
			id={index}
			attribute={(clients) => {
				fixed.get_children().forEach(ch => ch.destroy());
				clients
					.filter(({ workspace: { id }}) => id === index)
					.forEach(c => {
						c.at[0] -= Hyprland.get_monitor(c.monitor)?.x || 0;
						c.at[1] -= Hyprland.get_monitor(c.monitor)?.y || 0;
						c.mapped && fixed.put(Client(c), c.at[0] * SCALE, c.at[1] * SCALE);
					});
	
				fixed.show_all();
			}}
		>
			<eventbox
				className={"eventbox"}
				hexpand
				vexpand
				onClick={() => {
					workspace(index)
				}}
				setup={(eventbox) => {
					eventbox.drag_dest_set(Gtk.DestDefaults.ALL, TARGET, Gdk.DragAction.COPY);
					eventbox.connect('drag-data-received', (_w, _c, _x, _y, data) => {
						movetoworkspacesilent(index, `${data.get_text()}`);
					});
				}}
			>
				{fixed}
			</eventbox>
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
		className={namespace}
		setup={(self) => {
			self.hook(Hyprland, "event", () => {
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

			self.hook(Hyprland, "notify::workspaces", () => {
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
			onKeyPressEvent={(self, event) => {
				if (event.get_keyval()[1] === Gdk.KEY_Escape) {
					App.toggle_window(self.name);
				}
			}}
		>
			{Overview()}
		</PopupWindow>
	);
};
