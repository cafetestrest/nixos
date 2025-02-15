import { bind, Variable } from "astal";
import { App, Gtk } from "astal/gtk3";
import icons from "../../../lib/icons"
import Notifications from "gi://AstalNotifd";

export default () => {
	const notifications = Notifications.get_default();
    const revealerVisible = Variable(false);
    const notifs = bind(notifications, "notifications");

    return (
        <button
        // onClicked={() => toggleWindow(namespace)}
        className={"bar-button"}
        // setup={(self) => {
        // 	const notificationsWindow = App.get_window(namespace);
        // 	if (notificationsWindow) {
        // 		self.hook(
        // 			notificationsWindow,
        // 			"notify::visible",
        // 			() => {
        // 				self.toggleClassName(
        // 					"active",
        // 					notificationsWindow.visible,
        // 				);
        // 			},
        // 		);
        // 	}
        // }}//todo
    >
        <box>
            <icon
                className={"bar-notifications-icon"}
                icon={bind(notifications, "dontDisturb").as(
                    (dnd) => icons.notifications[dnd ? "silent" : "noisy"],
                )}
            />
            <label
                className="bar__notifications_label"
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
                    className="bar-last-notification-label"
                    maxWidthChars={40}
                    label={bind(notifications, "notifications").as(n => n.reverse()[0]?.summary || "")}
                />
            </revealer>
        </box>
    </button>
    );
}
