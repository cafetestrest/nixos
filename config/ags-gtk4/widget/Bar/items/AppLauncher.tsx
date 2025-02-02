import { App, Gtk, Gdk, hook } from "astal/gtk4";
import BarButton from "../BarButton";
import { toggleWindow } from "../../../lib/utils";
import { namespace } from "../../AppLauncher";

export default () => (
	<BarButton
		className="bar__app-launcher"
		onClicked={() => {
			toggleWindow(namespace);
		}}
		onButtonReleased={(_, event) => {
			switch (event.get_button()) {
				case Gdk.BUTTON_SECONDARY:
					return toggleWindow(namespace);
				case Gdk.BUTTON_MIDDLE:
					return toggleWindow(namespace);
		}}}
		setup={(self) => {
			const applauncherWindow = App.get_window(namespace);
			if (applauncherWindow) {
				hook(self, applauncherWindow, "notify::visible", () => {
					if (applauncherWindow.visible) {
						self.add_css_class("active")
					} else {
						self.remove_css_class("active")
					}
				})
			}
		}}
	>
		<box
			cssClasses={["bar__app-launcher_icon"]}
			valign={Gtk.Align.CENTER}
			halign={Gtk.Align.CENTER}
			hexpand={true}
			vexpand={true}
		>
			<label cssClasses={["distro-icon"]} label={""} valign={Gtk.Align.END} halign={Gtk.Align.END} hexpand={false} vexpand={false} />
		</box>
	</BarButton>
);
