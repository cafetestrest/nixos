import { Gtk, Gdk, Widget, Astal, hook } from "astal/gtk4";
import icons from "../../lib/icons";
import { Subscribable } from "astal/binding";
import { controlCenterPage, namespace } from ".";
import Network from "gi://AstalNetwork?version=0.1";
import { namespace as applaunchernamespace, showWidgetControlCenter } from "../AppLauncher";
import { toggleWindow } from "../../lib/utils";
import Pango from "gi://Pango";

type ControlCenterButtonProps = {
	icon: Widget.IconProps["icon"];
	label?: Widget.LabelProps["label"];
	onPrimaryClick?: () => void;
	menuName?: string;
	connection?: [Subscribable<unknown>, () => boolean];
	className?: Widget.ButtonProps["className"];
} & Widget.ButtonProps;

export default ({
	icon,
	label,
	menuName,
	onPrimaryClick,
	connection,
	className,
	...props
}: ControlCenterButtonProps) => {
	return (
		<button
			cssClasses={[`${className}`, "toggles", "control-center__button", `${!label && "no-label"}`]}
			setup={(self) => {
				if (connection) {
					let [service, condition] = connection;

					if (condition()) {
						self.add_css_class("active")
					} else {
						self.remove_css_class("active")
					}

					hook(self, service, () => {
						if (condition()) {
							self.add_css_class("active")
						} else {
							self.remove_css_class("active")
						}
					});
				}
			}}
			onButtonPressed={(_, event: Gdk.ButtonEvent) => {
				switch (event.get_button()) {
					case Gdk.BUTTON_PRIMARY:
						if (onPrimaryClick) {
							onPrimaryClick();
						}
						break;
					case Gdk.BUTTON_SECONDARY:
					case Gdk.BUTTON_MIDDLE:
						if (menuName && menuName !== 'arrow') {
							if (menuName == "network") {
								const network = Network.get_default();
								const { wifi } = Network.get_default();
								if (wifi == null) return;
							}
							controlCenterPage.set(menuName);
						}
						break;
			}}}
			onKeyPressed={(_, keyval) => {
				if (menuName && menuName !== 'arrow' && (keyval === Gdk.KEY_Return || keyval === Gdk.KEY_space || keyval === Gdk.KEY_KP_Enter)) {
					if (showWidgetControlCenter.get()) {
						toggleWindow(applaunchernamespace)
						toggleWindow(namespace)
					}
					controlCenterPage.set(menuName);
				} else if (keyval === Gdk.KEY_Return || keyval === Gdk.KEY_space || keyval === Gdk.KEY_KP_Enter) {
					if (onPrimaryClick) {
						onPrimaryClick();
					}
				}
			}}
			{...props}
		>
			<box
				hexpand
				spacing={12}
				halign={!label ? Gtk.Align.CENTER : Gtk.Align.FILL}
			>
				<image iconName={icon} />
				{label && (
					<label
						label={label}
						halign={Gtk.Align.START}
						hexpand
						ellipsize={Pango.EllipsizeMode.END}
					/>
				)}
				{menuName && (
					<box hexpand={false} halign={Gtk.Align.END} cssClasses={["button-arrow"]}>
						<image
							halign={Gtk.Align.END}
							iconName={icons.ui.arrow.right}
						/>
					</box>
				)}
			</box>
		</button>
	);
};
