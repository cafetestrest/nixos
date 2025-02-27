import { Astal, Gtk, Gdk, App } from "astal/gtk4";
import Notifd from "gi://AstalNotifd";
import Notification from "./Notification";
import { type Subscribable } from "astal/binding";
import { Variable, bind, timeout } from "astal";
import {
    namespaceNotification,
    notificationWidth,
    notificationBoxTopMargin,
    notificationContentWidth,
    notificationSpacing,
    notificationScrollableMaxHeight,
    notificationHeight,
    removeAllPreviousNotificationOnStart
} from "../common/Variables";

// The purpose if this class is to replace Variable<Array<Widget>>
// with a Map<number, Widget> type in order to track notification widgets
// by their id, while making it conviniently bindable as an array
class NotifiationMap implements Subscribable {
    // the underlying map to keep track of id widget pairs
    private map: Map<number, Gtk.Widget> = new Map()

    // it makes sense to use a Variable under the hood and use its
    // reactivity implementation instead of keeping track of subscribers ourselves
    private var: Variable<Array<Gtk.Widget>> = Variable([])

    // notify subscribers to rerender when state changes
    private notifiy() {
        this.var.set([...this.map.values()].reverse())
    }

    constructor() {
        const notifd = Notifd.get_default()

        /**
         * uncomment this if you want to
         * ignore timeout by senders and enforce our own timeout
         * note that if the notification has any actions
         * they might not work, since the sender already treats them as resolved
         */
        notifd.ignoreTimeout = true

        notifd.connect("notified", (_, id) => {
            this.set(id, Notification({
                notification: notifd.get_notification(id)!,

                // once hovering over the notification is done
                // destroy the widget without calling notification.dismiss()
                // so that it acts as a "popup" and we can still display it
                // in a notification center like widget
                // but clicking on the close button will close it
                onHoverLeave: () => {},

                // notifd by default does not close notifications
                // until user input or the timeout specified by sender
                // which we set to ignore above
                setup: () => {}
            }))
        })

        // notifications can be closed by the outside before
        // any user input, which have to be handled too
        notifd.connect("resolved", (_, id) => {
            this.delete(id)
        })
    }

    private set(key: number, value: Gtk.Widget) {
        // in case of replacecment destroy previous widget
        this.map.get(key)?.unparent()
        this.map.set(key, value)
        this.notifiy()
    }

    private delete(key: number) {
        this.map.get(key)?.unparent()
        this.map.delete(key)
        this.notifiy()
    }

    // needed by the Subscribable interface
    get() {
        return this.var.get()
    }

    // needed by the Subscribable interface
    subscribe(callback: (list: Array<Gtk.Widget>) => void) {
        return this.var.subscribe(callback)
    }
}

function hide() {
    App.get_window(namespaceNotification)!.hide()
}

const NotificationsWindow = ({notifications, notifs}: {notifications: Notifd.Notifd, notifs: NotifiationMap}) => (
	<box vertical={true} cssClasses={["notifications-window"]} spacing={notificationSpacing}>
		<box
            cssClasses={["notification-scroll-box"]}
            heightRequest={bind(notifications, "notifications").as(n => {
                return Math.min(n.length * notificationHeight, notificationScrollableMaxHeight);
            })}
        >
			<Gtk.ScrolledWindow
                cssClasses={["notifications-scrollable"]}
            >
				<box
					cssClasses={["notifications-window-list"]}
                    vertical
					spacing={6}
					hexpand={true}
					// noImplicitDestroy={true} // todo
				>
					{bind(notifs)}
				</box>
			</Gtk.ScrolledWindow>
		</box>
		<button
			halign={Gtk.Align.END}
			hexpand={false}
			cssClasses={["notifications-window-clear"]}
			onClicked={() => {
				notifications.get_notifications().forEach((n) => {
					timeout(150, () => n.dismiss());
				});
                hide();
			}}
			>
			<label
				cssClasses={["notifications-window-clear-label"]}
				label={"Clear all"}
			></label>
		</button>
	</box>
);

export const AllNotifications = () => {
	const notifs = new NotifiationMap();
	const notifications = Notifd.get_default();

    if (removeAllPreviousNotificationOnStart) {
        // This will remove all existing notifications on startup
        notifications.get_notifications().forEach((n) => n.dismiss());
    }

	return(<NotificationsWindow notifs={notifs} notifications={notifications} />)
};

export default function NotificationPopupWindow() {
    return <window
        name={namespaceNotification}
        namespace={namespaceNotification}
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM}
        exclusivity={Astal.Exclusivity.IGNORE}
        keymode={Astal.Keymode.ON_DEMAND}
        application={App}
        visible={false}
        onShow={(self) => {
            notificationWidth.set(self.get_current_monitor().geometry.width);
        }}
        onKeyPressed={(_, keyval: number) => {
            if (keyval === Gdk.KEY_Escape)
                hide()
        }}>
        <box cssClasses={["Popup"]}>
            <box widthRequest={notificationWidth(w => w / 2)} hexpand={true} vexpand={true} onButtonPressed={hide} />
            <box hexpand={false} vertical={true}>
                <box heightRequest={notificationBoxTopMargin} onButtonPressed={hide} />
                <box widthRequest={notificationContentWidth} cssClasses={["popup-box"]} vertical={true}>
                    <AllNotifications />
                </box>
                <box hexpand={true} vexpand={true} onButtonPressed={hide} />
            </box>
            <box widthRequest={notificationWidth(w => w / 2)} hexpand={true} vexpand={true} onButtonPressed={hide} />
        </box>
    </window>
}
