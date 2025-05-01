import icons from "../../../lib/icons";
import QSToggleBlueprint from "../items/QSToggleBlueprint";
import AstalWp from "gi://AstalWp?version=0.1";
import { bind } from "ags/state";

export default () => {
    const { defaultMicrophone: mic } = AstalWp.get_default()!;

    if (!mic) {
        return (
            <box cssClasses={["empty-toggle"]}/>
        );
    }

    const mute = bind(mic, "mute");

    return (
        <QSToggleBlueprint
            className={mute.as((muted) => muted ? ["toggles", "control-center-button", "active"] : ["toggles", "control-center-button", "inactive"])}
            icon={mute.as((muted) => icons.audio.mic[muted ? "muted" : "high"])}
            label={mute.as((muted) => muted ? "Muted" : "Unmuted")}
            clicked={() => {
                mic.mute = !mic.mute
                // mic.set_mute(false)
                // todo does not apply
            }}
        />
    );
}
