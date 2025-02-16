import { App, Gtk, Astal, Gdk } from "astal/gtk3";
import { bind, timeout, Variable } from "astal";
import Notifd from "gi://AstalNotifd?version=0.1";
import Notification from "./Notification";
import { spacing } from "../../lib/variables";
import PopupWindow from "../../common/PopupWindow";
import { Subscribable } from "astal/binding";

export const namespace = "notifications";

class NotificationsMap implements Subscribable {
	private map: Map<number, Gtk.Widget> = new Map();
	private var: Variable<Array<Gtk.Widget>> = Variable([]);

	private notifiy() {
		this.var.set([...this.map.values()].reverse());
	}

	constructor() {
		const notifd = Notifd.get_default();
		notifd.set_ignore_timeout(true);

		notifd.connect("notified", (_, id) => {
			this.set(
				id,
				Notification({
					notification: notifd.get_notification(id)!,
					onHoverLost: () => {},
					setup: (self) => {},
				}),
			);
		});
		notifd.connect("resolved", (_, id) => {
			this.map.get(id)?.close(() => this.delete(id));
		});
	}

	private set(key: number, value: Gtk.Widget) {
		this.map.get(key)?.destroy();
		this.map.set(key, value);
		this.notifiy();
	}

	private delete(key: number) {
		this.map.get(key)?.destroy();
		this.map.delete(key);
		this.notifiy();
	}

	get() {
		return this.var.get();
	}

	subscribe(callback: (list: Array<Gtk.Widget>) => void) {
		return this.var.subscribe(callback);
	}
}

export const notifs = new NotificationsMap();
export const notifications = Notifd.get_default();

export const NotificationsWindow = ({notifications, notifs}: {notifications: Notifd.Notifd, notifs: NotificationsMap}) => (
	<box vertical className="notifications-window" spacing={spacing}>
		<box className={"notification-scroll-box"}>
			<scrollable vexpand className={"notifications-scrollable"}>
				<box
					className="notifications-window__list"
					visible={true}
					orientation={Gtk.Orientation.VERTICAL}
					spacing={6}
					vexpand={true}
					hexpand={true}
					noImplicitDestroy
				>
					{bind(notifs)}
				</box>
			</scrollable>
		</box>
		<button
			halign={Gtk.Align.END}
			hexpand={false}
			className="notifications-window__clear"
			onClicked={() => {
				notifications.get_notifications().forEach((n) => {
					timeout(150, () => n.dismiss());
				});
			}}
			>
			<label
				className="notifications-window__clear-label"
				label={"Clear all"}
			></label>
		</button>
	</box>
);

export const AllNotifications = () => {
	const notifs = new NotificationsMap();
	const notifications = Notifd.get_default();

	return(<NotificationsWindow notifs={notifs} notifications={notifications} />)
};

export default () => {
	notifications.get_notifications().forEach((n) => n.dismiss()); // This will remove all existing notifications on startup

	return (
		<PopupWindow
			scrimType="transparent"
			layer={Astal.Layer.OVERLAY}
			visible={false}
			margin={12}
			vexpand={true}
			keymode={Astal.Keymode.EXCLUSIVE}
			name={namespace}
			namespace={namespace}
			className={namespace}
			exclusivity={Astal.Exclusivity.NORMAL}
			anchor={Astal.WindowAnchor.TOP}
			application={App}
			onKeyPressEvent={(self, event) => {
				if (event.get_keyval()[1] === Gdk.KEY_Escape) {
					App.toggle_window(self.name);
				}
			}}
			setup={(self) => {
				self.hook(notifications, "notify::notifications", () => {
					if (notifications.get_notifications().length == 0) {
						timeout(500, () => {
							self.visible = false;
						});
					}
				});
			}}
		>
			<NotificationsWindow notifs={notifs} notifications={notifications} />
		</PopupWindow>
	);
};
