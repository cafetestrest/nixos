import { Gtk, Widget, App } from "astal/gtk4";
import { type EventBox } from "astal/gtk4/widget";
import { timeout, GLib, idle, bind } from "astal";
import Notifd from "gi://AstalNotifd";
import icons from "../../lib/icons";
import { widgetNotificationsQuery } from "../AppLauncher";
import Pango from "gi://Pango";

const transitionDuration = 300;

const time = (time: number, format = "%H:%M") =>
	GLib.DateTime.new_from_unix_local(time).format(format);

type NotificationIconProps = {
	notification: Notifd.Notification;
};

const NotificationIcon = ({ notification }: NotificationIconProps) => {
	var { appName, appIcon, image } = notification;
	if (image) {
		if (image.includes("file://")) image = image.replace("file://", "");

		return (
			<box
				valign={Gtk.Align.START}
				hexpand={false}
				cssClasses={["notification__icon"]}
				setup={() => {
					App.apply_css(`.notification__icon {
						background-image: url("file://${image}");
						background-size: cover;
						background-repeat: no-repeat;
						background-position: center;
						min-width: 1.286rem;
						min-height: 1.286rem;
					}`);
				}}
			/>
		);
	}

	if (appIcon) {
		return (
			<box
				valign={Gtk.Align.START}
				hexpand={false}
				cssClasses={["notification-app-icon"]}
				setup={() => {
					App.apply_css(`.notification-app-icon {
						background-image: url("file://${appIcon}");
						background-size: cover;
						background-repeat: no-repeat;
						background-position: center;
					}`);
				}}
			/>
		);
	}

	let icon = icons.fallback.notification;

	return Widget.Box({
		valign: Gtk.Align.START,
		hexpand: false,
		cssClasses: ["notification__icon"],
		child: new Gtk.Image({
			iconName: icon,
			// iconSize: 18,
			halign: Gtk.Align.CENTER,
			valign: Gtk.Align.CENTER,
			hexpand: true,
		}),
	});
};

type NotificationsProps = {
	setup(self: EventBox): void;
	onHoverLost(self: EventBox): void;
	notification: Notifd.Notification;
};

export default function Notification(props: NotificationsProps) {
	const { notification, onHoverLost, setup } = props;

	const Content = () => (
		<box hexpand={true} cssClasses={["content"]} visible={bind(widgetNotificationsQuery).as((query) => {
			if (!query)
				return true;

			if (query.startsWith(":n "))
				query = query.replace(":n ", "");

			if (!query)
				return true;

			if (query.startsWith(":n"))
				query = query.replace(":n", "");

			if (!query)
				return true;

			const body = notification.body.toLowerCase().trim();

			if (body && body.includes(query.toLowerCase().trim()))
				return true;

			const summary = notification.summary.toLowerCase().trim();

			if (summary && summary.includes(query.toLowerCase().trim()))
				return true;

			return false;
		})}>
			<NotificationIcon notification={notification} />
			<box hexpand={true} vexpand={true} vertical={true}>
				<box
					cssClasses={["notification__header"]}
					vexpand={true}
					valign={Gtk.Align.START}
				>
					<box hexpand={true} vertical>
						<box>
							<label
								halign={Gtk.Align.START}
								cssClasses={["notification__title"]}
								// maxWidthChars={14}
								// wrap={true}
								justify={Gtk.Justification.LEFT}
								ellipsize={Pango.EllipsizeMode.END}
								useMarkup={true}
								label={notification.summary.trim()}
								hexpand
							/>
							<label
								halign={Gtk.Align.END}
								cssClasses={["notification__time"]}
								label={time(notification.time)?.toString()}
							/>
						</box>
						<label
							cssClasses={["notification__description"]}
							hexpand={true}
							useMarkup={true}
							xalign={0}
							lines={3}
							justify={Gtk.Justification.LEFT}
							ellipsize={Pango.EllipsizeMode.END}
							maxWidthChars={24}
							wrap={true}
							label={notification.body.trim().toString()}
						/>
					</box>
				</box>
			</box>
			<button
				vexpand={true}
				valign={Gtk.Align.START}
				cssClasses={["notification__close-button"]}
				onClicked={() => {
					notification.dismiss();
				}}
			>
				<image iconName={"window-close-symbolic"} />
			</button>
		</box>
	);

	const ActionsBox = () =>
		notification.get_actions() && (
			<box cssClasses={["notification__actions"]}>
				{notification.get_actions().map((action) => (
					<button
						cssClasses={["notification__action"]}
						on_clicked={() => notification.invoke(action.id)}
						hexpand={true}
					>
						<label label={action.label} />
					</button>
				))}
			</box>
		);

	const Eventbox = () => (
		<box vexpand={false} onHoverLeave={onHoverLost} setup={setup}>
			<box vertical={true}>
				<Content />
				<ActionsBox />
			</box>
		</box>
	);

	const box = Widget.Revealer({
		transitionType: Gtk.RevealerTransitionType.SLIDE_DOWN,
		transitionDuration: 300,
		setup: (self) => {
			idle(() => {
				self.revealChild = true;
			});
		},
		child: (
			<box
				valign={Gtk.Align.START}
				cssClasses={["notification", `${notification.urgency}`]}
			>
				<Eventbox />
			</box>
		),
	});

	let isClosing = false;

	return Object.assign(box, {
		close(remove: () => void) {
			if (isClosing) return;
			isClosing = true;
            box.revealChild = false;
            timeout(transitionDuration, () => {
                remove();
            });
		},
	});
}
