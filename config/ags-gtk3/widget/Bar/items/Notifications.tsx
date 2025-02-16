import { bind } from "astal";
import { App, Gtk } from "astal/gtk3";
import BarButton from "../BarButton";
import Notifications from "gi://AstalNotifd";
import { toggleWindow } from "../../../lib/utils";
import icons from "../../../lib/icons";
import { namespace } from "../../Notifications";

export default () => {
	const notifications = Notifications.get_default();

	return (
		<revealer
			className={"notification-revealer"}
			visible={notifications.get_notifications().length > 0}
			revealChild={notifications.get_notifications().length > 0}
			transitionDuration={300}
			transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
			setup={(self) => {
				self.hook(notifications, "notify::notifications", () => {
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
				className={"bar__notifications"}
				onClicked={() => {
					toggleWindow(namespace);
				}}
				setup={(self) => {
					const notificationsWindow = App.get_window(namespace);
					if (notificationsWindow) {
						self.hook(
							notificationsWindow,
							"notify::visible",
							() => {
								self.toggleClassName(
									"active",
									notificationsWindow.visible,
								);
							},
						);
					}
				}}
			>
				<box>
					<icon
						valign={Gtk.Align.CENTER} halign={Gtk.Align.START}
						className={"bar-notifications-icon"}
						icon={bind(notifications, "dontDisturb").as(
							(dnd) => icons.notifications[dnd ? "silent" : "noisy"],
						)}
					/>
					<label
						halign={Gtk.Align.START}
						valign={Gtk.Align.CENTER}
						className="bar__notifications_label"
						label={bind(notifications, "notifications").as((n) => n.length > 1 ? n.length.toString(): '')}
					/>
					<revealer
						className={"notification-label-revealer"}
						setup={(self) => {
							self.hook(notifications, "notify::notifications", () => {
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
							className="bar-last-notification-label"
							maxWidthChars={40}
							label={bind(notifications, "notifications").as(n => n.reverse()[0]?.summary || '')}
						/>						
					</revealer>
				</box>
			</BarButton>
		</revealer>
	);
};
