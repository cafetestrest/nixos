import { Gtk, Gdk } from "astal/gtk3";
import { Variable } from "astal";
import AstalHyprland from "gi://AstalHyprland";
import {
    overviewScale,
} from "../common/Variables";
import Window from "./Window";

const Hyprland = AstalHyprland.get_default();
const TARGET = [Gtk.TargetEntry.new("text/plain", Gtk.TargetFlags.SAME_APP, 0)]

export default (id: number) => {
    const fixed = Gtk.Fixed.new();

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
					const x = c.at[0] - (Hyprland.get_monitor(c.monitor.id)?.x || 0)
					const y = c.at[1] - (Hyprland.get_monitor(c.monitor.id)?.y || 0)
					c.mapped && fixed.put(Window(c), x * overviewScale, y * overviewScale)
				})
			fixed.show_all();
		})
	}

	const focusedMonitor = Hyprland.get_focused_monitor();
	const scaleVar = Variable(overviewScale);
	const workspace = (index: number) => Hyprland.dispatch("workspace", `${index}`);
	const movetoworkspacesilent = (workspace: number, address: string) =>
		Hyprland.dispatch("movetoworkspacesilent", `${workspace}, address:${address}`);

    return (
        <box
			tooltipText={`${id}`}
			className={"workspace"}
			valign={Gtk.Align.CENTER}
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
		</box>
    );
}
