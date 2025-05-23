import { bind, Variable } from "astal";
import { App, Gtk } from "astal/gtk3";
import icons from "../../../lib/icons";
import Notifications from "gi://AstalNotifd";
import { enableBarNotifications, namespaceNotification } from "../../common/Variables";

export default () => {
    if (enableBarNotifications === false) {
        return (
            <box visible={false} />
        );
    }

	const notifications = Notifications.get_default();
    const revealerVisible = Variable(false);
    const notifs = bind(notifications, "notifications");

    return (
        <button
        onClicked={() => App.toggle_window(namespaceNotification)}
        className={"bar-button"}
        visible={notifs.as(n => n.length > 0)}
        setup={(self) => {
        	const notificationsWindow = App.get_window(namespaceNotification);
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
                className={"bar-notifications-icon"}
                icon={bind(notifications, "dontDisturb").as(
                    (dnd) => icons.notifications[dnd ? "silent" : "noisy"],
                )}
            />
            <label
                className={"bar-notifications-label"}
                visible={notifs.as((n) => n.length > 1)}
                label={notifs.as((n) => n.length > 1 ? n.length + "" : "")}
            />
            <revealer
                className={"notification-revealer"}
                visible={bind(revealerVisible)}
                revealChild={notifications.get_notifications().length > 0}
                transitionDuration={300}
                transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
                setup={(self) => {
                    self.hook(notifications, "notify::notifications", () => {
                        revealerVisible.set(true);
                        self.reveal_child = true;
                        self.visible = true;

                        setTimeout(() => {
                            revealerVisible.set(false);
                            self.reveal_child = false;
                            self.visible = false;
                        }, 5000);	// 5 sec
                    });
                }}
            >
                <label
                    className={"bar-last-notification-label"}
                    maxWidthChars={40}
                    label={bind(notifications, "notifications").as(n => n.reverse()[0]?.summary || "")}
                />
            </revealer>
        </box>
    </button>
    );
}
