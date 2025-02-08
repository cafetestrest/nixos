import { bind } from "astal"
import icons from "../../../lib/icons";
import { Gtk } from "astal/gtk3";
import AstalNotifd from "gi://AstalNotifd";
import { referenceWord } from "../../common/Variables";

export default () => {
	const notifications = AstalNotifd.get_default();
    const dnd = bind(notifications, "dontDisturb");
    const hasArrow = false;

    return (
        <button
            className={bind(dnd.as(() => {
                if (notifications.dontDisturb) {
                    return "toggles control-center-button active";
                }
                return "toggles control-center-button";
            }))}
            onClicked={() => notifications.dontDisturb = !notifications.dontDisturb}
        >
            <box
                halign={Gtk.Align.FILL}
            >
                <icon
                    icon={dnd.as((dnd) => icons.notifications[dnd ? "silent" : "noisy"])}
                />
                <label
                    halign={Gtk.Align.START}
                    label={referenceWord}
                    hexpand
                />
                {hasArrow && (
                    <icon
                        halign={Gtk.Align.END}
                        icon={icons.ui.arrow.right}
                    />
                )}
            </box>
        </button>
    );
}
