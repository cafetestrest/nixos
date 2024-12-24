import { Gtk, Gdk, Widget } from "astal/gtk3";
import Hyprland from "gi://AstalHyprland";
// import { range } from "../../../lib/utils";
// import BarItem from "../BarItem";
// import { bind } from "astal";

export default () => {
	const hypr = Hyprland.get_default();
	const ws: number = 0;

	const dispatch = (command: string) => hypr.dispatch("workspace", command);

// Adding `workspace-tile-focused` to focused worspace
const setupWorkspaceTile = (i: number) => (self: Widget.Button) => {
	self.hook(hypr, "event", () => {
		self.toggleClassName(
		"focused",
		i === hypr.focusedWorkspace.id
		);

		self.toggleClassName(
		"active",
		Boolean(hypr.get_workspace(i)?.clients.length)
		);
	});
	};
	return (
		<eventbox
			className="workspaces"
			onScroll={(self, event) => {
				if (event.delta_y < 0) {
					dispatch('+1')
				} else {
					dispatch('-1')
				}
			}}
			onClickRelease={(self, event) => {
				switch (event.button) {
					case Gdk.BUTTON_SECONDARY:
						return dispatch('1')
					case Gdk.BUTTON_MIDDLE:
						return dispatch('1')
			}}}
		>
		<box
			className="workspaces-box"
			setup={(self) => {
				if (ws === 0) {
					self.hook(hypr, "event", () => self.children.map(btn => {
						btn.visible = hypr.workspaces.some(ws => {
							if (ws.id < 10)
								return ws.id +1 >= btn.attribute

							return ws.id >= btn.attribute
						});
					}));
				}
			}}
		>
			{Array.from({ length: ws || 10 }, (_, i) => i + 1).map(i => (
			<button
				halign={Gtk.Align.CENTER}
				valign={Gtk.Align.CENTER}
				className="bar__workspaces-indicator"
				// cursor="pointer"
				onClicked={() => hypr.dispatch("workspace", `${i}`)}
				setup={setupWorkspaceTile(i)}
				attribute={i}
			><box className={"workspace-dot"} /></button>
			))}
		</box>
		</eventbox>
	);
};
