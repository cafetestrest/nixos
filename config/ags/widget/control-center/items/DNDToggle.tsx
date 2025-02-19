import { bind } from "astal";
import icons from "../../../lib/icons";
import AstalNotifd from "gi://AstalNotifd";
import QSToggle from "./QSToggle";

export default () => {
	const notifications = AstalNotifd.get_default();
    const dnd = bind(notifications, "dontDisturb");

    return (
        <QSToggle
            className={bind(dnd.as(() => {
                if (notifications.dontDisturb) {
                    return "toggles control-center-button active";
                }
                return "toggles control-center-button";
            }))}
            onPrimaryClick={() => notifications.dontDisturb = !notifications.dontDisturb}
            icon={dnd.as((dnd) => icons.notifications[dnd ? "silent" : "noisy"])}
            label={"Do not disturb"}
            hasArrow={false}
        />
    );
}
