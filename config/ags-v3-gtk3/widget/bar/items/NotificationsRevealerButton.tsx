import { Astal, Gtk } from "ags/gtk3";
import App from "ags/gtk3/app";
import icons from "../../../lib/icons";
import Notifications from "gi://AstalNotifd";
import { enableBarNotifications, namespaceNotification } from "../../common/Variables";
import { createBinding, createState } from "ags";

export default () => {
    if (enableBarNotifications === false) {
        return (
            <box visible={false} />
        );
    }

	const notifications = Notifications.get_default();
    const [revealerVisible, setRevealerVisible] = createState(false);
    const notifs = createBinding(notifications, "notifications");

    return (
        <button
        onClicked={() => App.toggle_window(namespaceNotification)}
        class={"bar-button"}
        visible={notifs.as(n => n.length > 0)}
        $={(self) => {
        	const notificationsWindow = App.get_window(namespaceNotification);
        	if (notificationsWindow) {
                notificationsWindow.connect("notify::visible", () => {
                    Astal.widget_toggle_class_name(self, "active", notificationsWindow.visible);
                });
        	}
        }}
    >
        <box>
            <icon
                class={"bar-notifications-icon"}
                icon={createBinding(notifications, "dontDisturb").as(
                    (dnd) => icons.notifications[dnd ? "silent" : "noisy"],
                )}
            />
            <label
                class={"bar-notifications-label"}
                visible={notifs.as((n) => n.length > 1)}
                label={notifs.as((n) => n.length > 1 ? n.length + "" : "")}
            />
            <revealer
                class={"notification-revealer"}
                visible={revealerVisible}
                revealChild={notifications.get_notifications().length > 0}
                transitionDuration={300}
                transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
                $={(self) => {
                    notifications.connect("notify::notifications", () => {
                        setRevealerVisible(true);
                        self.reveal_child = true;
                        self.visible = true;

                        setTimeout(() => {
                            setRevealerVisible(false);
                            self.reveal_child = false;
                            self.visible = false;
                        }, 5000);	// 5 sec
                    });
                }}
            >
                <label
                    class={"bar-last-notification-label"}
                    maxWidthChars={40}
                    label={createBinding(notifications, "notifications").as(n => n.reverse()[0]?.summary || "")}
                />
            </revealer>
        </box>
    </button>
    );
}
