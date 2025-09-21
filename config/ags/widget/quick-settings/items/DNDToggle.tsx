import icons from "../../../lib/icons";
import AstalNotifd from "gi://AstalNotifd";
import QSToggle from "./QSToggle";
import { createBinding } from "ags";

export default () => {
	const notifications = AstalNotifd.get_default();
    const dnd = createBinding(notifications, "dontDisturb");

    return (
        <QSToggle
            className={dnd.as(() => {
                if (notifications.dontDisturb) {
                    return "toggles quick-settings-button active";
                }
                return "toggles quick-settings-button";
            })}
            onPrimaryClick={() => notifications.dontDisturb = !notifications.dontDisturb}
            icon={dnd.as((dnd) => icons.notifications[dnd ? "silent" : "noisy"])}
            label={"Do not disturb"}
            hasArrow={false}
        />
    );
}
