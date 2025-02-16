import { Astal, Gtk, Gdk, App } from "astal/gtk3"
import Notifd from "gi://AstalNotifd"
import Notification from "./Notification"
import { type Subscribable } from "astal/binding"
import { Variable, bind, timeout } from "astal"
import {
    namespaceNotification,
    notificationWidth,
    notificationBoxTopMargin,
    notificationContentWidth,
    notificationSpacing,
    notificationScrollableMaxHeight,
    notificationHeight
} from "../common/Variables"

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
                onHoverLost: () => {},

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
        this.map.get(key)?.destroy()
        this.map.set(key, value)
        this.notifiy()
    }

    private delete(key: number) {
        this.map.get(key)?.destroy()
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

// export default function NotificationPopupWindow(gdkmonitor: Gdk.Monitor) {
//     const { TOP, RIGHT } = Astal.WindowAnchor
//     const notifs = new NotifiationMap()

//     return <window
//         className={"NotificationPopups"}
//         namespace={"notifications-popup"}
//         gdkmonitor={gdkmonitor}
//         anchor={TOP}>
//         <box vertical noImplicitDestroy>
//             {bind(notifs)}
//         </box>
//     </window>
// }

function hide() {
    App.get_window(namespaceNotification)!.hide()
}

const NotificationsWindow = ({notifications, notifs}: {notifications: Notifd.Notifd, notifs: NotifiationMap}) => (
	<box vertical className={"notifications-window"} spacing={notificationSpacing}>
		<box className={"notification-scroll-box"}>
			<scrollable
                className={"notifications-scrollable"}
                heightRequest={bind(notifications, "notifications").as(n => {
                    return Math.min(n.length * notificationHeight, notificationScrollableMaxHeight);
                })}
            >
				<box
					className={"notifications-window-list"}
					visible={true}
					orientation={Gtk.Orientation.VERTICAL}
					spacing={6}
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
			className={"notifications-window-clear"}
			onClicked={() => {
				notifications.get_notifications().forEach((n) => {
					timeout(150, () => n.dismiss());
				});
			}}
			>
			<label
				className={"notifications-window-clear-label"}
				label={"Clear all"}
			></label>
		</button>
	</box>
);

export const AllNotifications = () => {
	const notifs = new NotifiationMap();
	const notifications = Notifd.get_default();
	notifications.get_notifications().forEach((n) => n.dismiss()); // This will remove all existing notifications on startup

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
            notificationWidth.set(self.get_current_monitor().workarea.width)
        }}
        onKeyPressEvent={function (self, event: Gdk.Event) {
            if (event.get_keyval()[1] === Gdk.KEY_Escape)
                self.hide()
        }}>
        <box className={"Popup"}>
            <eventbox widthRequest={notificationWidth(w => w / 2)} expand onClick={hide} />
            <box hexpand={false} vertical>
                <eventbox heightRequest={notificationBoxTopMargin} onClick={hide} />
                <box widthRequest={notificationContentWidth} className={"dashboard"} vertical>
                    <AllNotifications />
                </box>
                <eventbox expand onClick={hide} />
            </box>
            <eventbox widthRequest={notificationWidth(w => w / 2)} expand onClick={hide} />
        </box>
    </window>
}
