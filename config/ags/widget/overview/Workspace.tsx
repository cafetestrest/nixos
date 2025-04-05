import { Gtk, Gdk } from "astal/gtk3";
import { Variable, bind } from "astal";
import AstalHyprland from "gi://AstalHyprland";
import {
    overviewScale,
	workspaces,
} from "../common/Variables";
import Window from "./Window";
import WorkspaceBox from "./WorkspaceBox";

const Hyprland = AstalHyprland.get_default();
const TARGET = [Gtk.TargetEntry.new("text/plain", Gtk.TargetFlags.SAME_APP, 0)]

export default (id: number) => {
    const fixed = Gtk.Fixed.new();

	const focusedMonitor = Hyprland.get_focused_monitor();

	async function update() {
		Hyprland.message_async("j/clients", (_, res) => {
			const clients = Hyprland.message_finish(res);
	
			if (!clients) {
				return;
			}

			fixed.get_children().forEach(ch => ch.destroy())
			JSON.parse(clients)
				.filter(({ workspace }) => workspace.id === id)
				.forEach(c => {
					c.at[0] -= Hyprland.get_monitor(c.monitor)?.x || 0;
					c.at[1] -= Hyprland.get_monitor(c.monitor)?.y || 0;
					c.mapped && fixed.put(Window(c), c.at[0] * overviewScale, c.at[1] * overviewScale);
				})
			fixed.show_all();
		})
	}

	const scaleVar = Variable(overviewScale);
	const workspace = (index: number) => Hyprland.dispatch("workspace", `${index}`);
	const movetoworkspacesilent = (workspace: number, address: string) =>
		Hyprland.dispatch("movetoworkspacesilent", `${workspace}, address:${address}`);

	const largestWorkspaceId = Variable.derive([
		bind(Hyprland, "focusedWorkspace"),
		bind(Hyprland, "clients"),
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
        <WorkspaceBox
			tooltipText={`${id}`}
			className={"workspace"}
			css={`
				min-width: ${focusedMonitor.width * overviewScale}px;
				min-height: ${focusedMonitor.height * overviewScale}px;
			`}
			setup={(box) => {
				update();
				box.hook(scaleVar, update)
				box.hook(Hyprland, "client-added", update)
				box.hook(Hyprland, "client-removed", update)
				box.hook(Hyprland, "client-moved", update)
			}}
			attribute={id}
			visible={bind(largestWorkspaceId).as(ws => {
				if (id > ws + 1) {
				  return false;
				}
				return true;
			})}
			onDestroy={() => largestWorkspaceId.drop()}
		>
			<eventbox
				className={"eventbox"}
				hexpand={true}
				onClick={() => {
					workspace(id)
				}}
				setup={(eventbox) => {
					eventbox.drag_dest_set(Gtk.DestDefaults.ALL, TARGET, Gdk.DragAction.COPY);
					eventbox.connect('drag-data-received', (_w, _c, _x, _y, data) => {
						const address = new TextDecoder().decode(data.get_data())

						movetoworkspacesilent(id, `${address}`);
					});
				}}
			>
				{fixed}
			</eventbox>
		</WorkspaceBox>
    );
}
