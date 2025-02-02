import { Gtk, Gdk, Widget, App, hook } from "astal/gtk4";
import Hyprland from "gi://AstalHyprland";
import { toggleWindow } from "../../../lib/utils";
import { namespace } from "../../Dashboard/Overview";

export default () => {
	const hypr = Hyprland.get_default();
	const ws: number = 0;

	const dispatch = (command: string) => hypr.dispatch("workspace", command);

// Adding `focused` to focused worspace
const setupWorkspaceTile = (i: number) => (self: Widget.Button) => {
	hook(self, hypr, "event", () => {
		if (i === hypr.focusedWorkspace.id) {
			self.add_css_class("focused");
		} else {
			self.remove_css_class("focused");
		}

		if (Boolean(hypr.get_workspace(i)?.clients.length)) {
			self.add_css_class("active");
		} else {
			self.remove_css_class("active");
		}
	});
	};
	return (
		<box
			cssClasses={["workspaces"]}
			onScroll={(_, dx, dy) => {
				if (dy < 0) {
					dispatch('+1')
				} else {
					dispatch('-1')
				}
			}}
			onButtonReleased={(_, event) => {
				switch (event.get_button()) {
					case Gdk.BUTTON_SECONDARY:
						return toggleWindow(namespace);
					case Gdk.BUTTON_MIDDLE:
						return dispatch('1')
			}}}
		>
			<box
				cssClasses={["workspaces-box"]}
				setup={(self) => {
					if (ws === 0) {
						hook(self, hypr, "event", () => self.children.map(btn => {
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
					cssClasses={["bar__workspaces-indicator"]}
					// cursor="pointer"
					onClicked={() => hypr.dispatch("workspace", `${i}`)}
					setup={setupWorkspaceTile(i)}
					attribute={i}
				><box cssClasses={["workspace-dot"]} /></button>
				))}
			</box>
		</box>
	);
};
