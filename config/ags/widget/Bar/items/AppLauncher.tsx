import { App, Gtk, Gdk } from "astal/gtk3";
import BarButton from "../BarButton";
import { toggleWindow } from "../../../lib/utils";
import { namespace } from "../../AppLauncher";

export default () => (
	<BarButton
		className="bar__app-launcher"
		onClicked={() => {
			toggleWindow(namespace);
		}}
		onClickRelease={(self, event) => {
			switch (event.button) {
				case Gdk.BUTTON_SECONDARY:
					return toggleWindow(namespace);
				case Gdk.BUTTON_MIDDLE:
					return toggleWindow(namespace);
		}}}
		setup={(self) => {
			const applauncherWindow = App.get_window(namespace);
			if (applauncherWindow) {
				self.hook(applauncherWindow, "notify::visible", () => {
					self.toggleClassName("active", applauncherWindow.visible);
				});
			}
		}}
	>
		<box
			className="bar__app-launcher_icon"
			valign={Gtk.Align.CENTER}
			halign={Gtk.Align.CENTER}
			hexpand={true}
			vexpand={true}
		>
			<label className={"distro-icon"} label={""} valign={Gtk.Align.END} halign={Gtk.Align.END} hexpand={false} vexpand={false} />
		</box>
	</BarButton>
);
