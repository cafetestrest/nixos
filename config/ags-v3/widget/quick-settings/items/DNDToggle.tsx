import icons from "../../../lib/icons";
import QSToggleBlueprint from "../items/QSToggleBlueprint";
import { createBinding } from "ags";
import AstalNotifd from "gi://AstalNotifd";

export default () => {
	const notifd = AstalNotifd.get_default();
    const dnd = createBinding(notifd, "dontDisturb");

    return (
        <QSToggleBlueprint
            className={dnd.as((_) => notifd.dontDisturb ? ["toggles", "control-center-button", "active"] : ["toggles", "control-center-button", "inactive"])}
            icon={dnd.as((dnd) => icons.notifications[dnd ? "silent" : "noisy"])}
            label={"Do not disturb"}
            clicked={() => {
                notifd.dontDisturb = !notifd.dontDisturb
            }}
        />
    );
}
