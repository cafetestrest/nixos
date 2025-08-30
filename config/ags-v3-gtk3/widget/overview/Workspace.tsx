import { Gtk, Gdk } from "ags/gtk3";
import AstalHyprland from "gi://AstalHyprland";
import {
    overviewScale,
	workspaces,
} from "../common/Variables";
import Window from "./Window";
import { createBinding, createComputed, createState, onCleanup, For } from "ags";

//todo types
export default (id: number) => {
	const Hyprland = AstalHyprland.get_default();
	const TARGET = [Gtk.TargetEntry.new("text/plain", Gtk.TargetFlags.SAME_APP, 0)]
    const fixed = Gtk.Fixed.new();

	const focusedMonitor = Hyprland.get_focused_monitor();

	const [clientsList, setClientsList] = createState<AstalHyprland.Client[]>([]);

	async function update() {
		Hyprland.message_async("j/clients", (_, res) => {
			const clients = Hyprland.message_finish(res);
	
			if (!clients) {
				return;
			}

			fixed.get_children().forEach(ch => ch.destroy());

			setClientsList(JSON.parse(clients).filter(({ workspace }: { workspace: AstalHyprland.Workspace }) => workspace.id === id));

			fixed.show_all();
		})
	}

	const workspace = (index: number) => Hyprland.dispatch("workspace", `${index}`);
	const movetoworkspacesilent = (workspace: number, address: string) =>
		Hyprland.dispatch("movetoworkspacesilent", `${workspace}, address:${address}`);

	const largestWorkspaceId = createComputed([
		createBinding(Hyprland, "focusedWorkspace"),
		createBinding(Hyprland, "clients"),
	  ], (focused, clients) => {
		const focusedId = focused.id;
	
		if (focusedId >= workspaces) {
		  return workspaces;
		}
	
		const maxClientWorkspaceId = clients.reduce((maxId, client) => {
		  return client.workspace.id > maxId ? client.workspace.id : maxId;
		}, 0);
	
		const max = Math.max(focusedId, maxClientWorkspaceId);
	
		if (max > workspaces) {
		  return workspaces;
		}
		return max;
	});

    return (
        <box
			tooltipText={`${id}`}
			class={"workspace"}
			css={`
				min-width: ${focusedMonitor.width * overviewScale}px;
				min-height: ${focusedMonitor.height * overviewScale}px;
			`}
			$={(box) => {
				update();
				// Connect signals
				const addedId = Hyprland.connect("client-added", update);
				const removedId = Hyprland.connect("client-removed", update);
				const movedId = Hyprland.connect("client-moved", update);

				// Cleanup connections when the box is destroyed
				onCleanup(() => {
					Hyprland.disconnect(addedId);
					Hyprland.disconnect(removedId);
					Hyprland.disconnect(movedId);
				});
			}}
			visible={largestWorkspaceId.as(ws => {
				if (id > ws + 1) {
				  return false;
				}
				return true;
			})}
		>
			<eventbox
				class={"eventbox"}
				hexpand={true}
				onClick={() => {
					workspace(id)
				}}
				$={(eventbox) => {
					eventbox.drag_dest_set(Gtk.DestDefaults.ALL, TARGET, Gdk.DragAction.COPY);
					const dragDataReceived = eventbox.connect('drag-data-received', (_w, _c, _x, _y, data) => {
						const address = new TextDecoder().decode(data.get_data())

						movetoworkspacesilent(id, `${address}`);
					});

					// Cleanup connections when the box is destroyed
					onCleanup(() => {
						eventbox.disconnect(dragDataReceived);
					});
				}}
			>
				<box>
					<For each={clientsList}>
						{(c) => {
							// adjust positions
							c.at[0] -= Hyprland.get_monitor(c.monitor)?.x || 0;
							c.at[1] -= Hyprland.get_monitor(c.monitor)?.y || 0;

							c.mapped && fixed.put(Window(c), c.at[0] * overviewScale, c.at[1] * overviewScale);

							return <box visible={false}/>
						}}
					</For>
					{fixed}
				</box>
			</eventbox>
		</box>
    );
}
