import { Gtk, Gdk, Widget, Astal } from "astal/gtk3";
import icons from "../../lib/icons";
import { Subscribable } from "astal/binding";
import { controlCenterPage, namespace } from ".";
import Network from "gi://AstalNetwork?version=0.1";
import { namespace as applaunchernamespace, showWidgetControlCenter } from "../AppLauncher";
import { toggleWindow } from "../../lib/utils";

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
			className={`${className} toggles control-center__button ${!label && "no-label"}`}
			setup={(self) => {
				if (connection) {
					let [service, condition] = connection;

					self.toggleClassName("active", condition());

					self.hook(service, () => {
						self.toggleClassName("active", condition());
					});
				}
			}}
			onClickRelease={(self, event: Astal.ClickEvent) => {
				switch (event.button) {
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
			onKeyReleaseEvent={(_, event) => {
				const key = event.get_keyval()[1];
				if (menuName && menuName !== 'arrow' && (key === Gdk.KEY_Return || key === Gdk.KEY_space || key === Gdk.KEY_KP_Enter)) {
					if (showWidgetControlCenter.get()) {
						toggleWindow(applaunchernamespace)
						toggleWindow(namespace)
					}
					controlCenterPage.set(menuName);
				} else if (key === Gdk.KEY_Return || key === Gdk.KEY_space || key === Gdk.KEY_KP_Enter) {
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
				<icon icon={icon} />
				{label && (
					<label
						label={label}
						halign={Gtk.Align.START}
						hexpand
						truncate
					/>
				)}
				{menuName && (
					<box hexpand={false} halign={Gtk.Align.END} className={"button-arrow"}>
						<icon
							halign={Gtk.Align.END}
							icon={icons.ui.arrow.right}
						/>
					</box>
				)}
			</box>
		</button>
	);
};
