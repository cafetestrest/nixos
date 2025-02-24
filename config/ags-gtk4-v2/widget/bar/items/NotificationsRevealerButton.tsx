import { bind, Variable } from "astal";
import { App, Gtk, hook } from "astal/gtk4";
import icons from "../../../lib/icons";
import Notifications from "gi://AstalNotifd";
import { namespaceNotification } from "../../common/Variables";

export default () => {
	const notifications = Notifications.get_default();
    const revealerVisible = Variable(false);
    const notifs = bind(notifications, "notifications");

    return (
        <button
        onClicked={() => App.toggle_window(namespaceNotification)}
        cssClasses={["bar-button"]}
        visible={notifs.as(n => n.length > 0)}
        setup={(self) => {
        	const notificationsWindow = App.get_window(namespaceNotification);
        	if (notificationsWindow) {
        		hook(
                    self,
        			notificationsWindow,
        			"notify::visible",
        			() => {
                        self[notificationsWindow.visible ? "add_css_class" : "remove_css_class"]("active");
        			},
        		);
        	}
        }}
    >
        <box>
            <image
                cssClasses={["bar-notifications-icon"]}
                iconName={bind(notifications, "dontDisturb").as(
                    (dnd) => icons.notifications[dnd ? "silent" : "noisy"],
                )}
            />
            <label
                cssClasses={["bar-notifications-label"]}
                visible={notifs.as((n) => n.length > 1)}
                label={notifs.as((n) => n.length > 1 ? n.length + "" : "")}
            />
            <revealer
                cssClasses={["notification-revealer"]}
                visible={bind(revealerVisible)}
                revealChild={notifications.get_notifications().length > 0}
                transitionDuration={300}
                transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
                setup={(self) => {
                    hook(self, notifications, "notify::notifications", () => {
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
                    cssClasses={["bar-last-notification-label"]}
                    maxWidthChars={40}
                    label={bind(notifications, "notifications").as(n => n.reverse()[0]?.summary || "")}
                />
            </revealer>
        </box>
    </button>
    );
}
