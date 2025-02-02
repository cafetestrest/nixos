import { Gtk, hook } from "astal/gtk4";
import AstalHyprland from "gi://AstalHyprland?version=0.1";
import BarItem from "../BarItem";

function getLayout(layoutName: string) {
	if (layoutName.includes("English")) {
		return "en";
	} else if (layoutName.includes("Russian")) {
		return "ru";
	} else {
		return "?";
	}
}

export default () => {
	const hyprland = AstalHyprland.get_default();

	return (
		<BarItem cssClasses={["bar__keyboard-layout"]}>
			<stack
				transitionType={Gtk.StackTransitionType.SLIDE_UP_DOWN}
				halign={Gtk.Align.CENTER}
				hexpand
				setup={(self) =>
					hook(
						self,
						hyprland,
						"keyboard-layout",
						(_, kbName, layoutName) => {
							if (!kbName) {
								return;
							}
							self.visibleChildName = getLayout(layoutName);
						},
					)
				}
			>
				<label name={"en"} label="en" />
				<label name={"ru"} label="ru" />
				<label name={"?"} label="?" />
			</stack>
		</BarItem>
	);
};
