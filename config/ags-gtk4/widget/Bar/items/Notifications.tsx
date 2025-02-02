import { bind } from "astal";
import { App, Gtk, hook } from "astal/gtk4";
import BarButton from "../BarButton";
import Notifications from "gi://AstalNotifd";
import { toggleWindow } from "../../../lib/utils";
import icons from "../../../lib/icons";
import { namespace } from "../../Notifications";

export default () => {
	const notifications = Notifications.get_default();

	return (
		<revealer
			cssClasses={["notification-revealer"]}
			visible={notifications.get_notifications().length > 0}
			revealChild={notifications.get_notifications().length > 0}
			transitionDuration={300}
			transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
			setup={(self) => {
				hook(self, notifications, "notify::notifications", () => {
					if (notifications.get_notifications().length > 0) {
						self.visible = true;
						self.reveal_child = true;
					} else {
						self.reveal_child = false;
						setTimeout(() => {
							self.visible = false;
						}, 300);
					}
				});
			}}
		>
			<BarButton
				className="bar__notifications"
				onClicked={() => {
					toggleWindow(namespace);
				}}
				setup={(self) => {
					const notificationsWindow = App.get_window(namespace);
					if (notificationsWindow) {
						hook(self, notificationsWindow, "notify::visible", () => {
							if (notificationsWindow.visible) {
								self.add_css_class("active")
							} else {
								self.remove_css_class("active")
							}
						});
					}
				}}
			>
				<box>
					<image
						valign={Gtk.Align.CENTER} halign={Gtk.Align.START}
						cssClasses={["bar-notifications-icon"]}
						iconName={bind(notifications, "dontDisturb").as(
							(dnd) => icons.notifications[dnd ? "silent" : "noisy"],
						)}
					/>
					<label
						halign={Gtk.Align.START}
						valign={Gtk.Align.CENTER}
						cssClasses={["bar__notifications_label"]}
						label={bind(notifications, "notifications").as((n) => n.length > 1 ? n.length.toString(): '')}
					/>
					<revealer
						cssClasses={["notification-label-revealer"]}
						setup={(self) => {
							hook(self, notifications, "notify::notifications", () => {
								self.reveal_child = true;
								self.visible = true;

								setTimeout(() => {
									self.reveal_child = false;
									self.visible = false;
								}, 5000);	// 5 sec
							});
						}}
					>
						<label
							halign={Gtk.Align.START}
							valign={Gtk.Align.CENTER}
							cssClasses={["bar-last-notification-label"]}
							maxWidthChars={40}
							label={bind(notifications, "notifications").as(n => n.reverse()[0]?.summary || '')}
						/>						
					</revealer>
				</box>
			</BarButton>
		</revealer>
	);
};
