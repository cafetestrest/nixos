import icons from "../../../lib/icons";
import Wp from "gi://AstalWp";
import QSToggle from "./QSToggle";
import { createBinding } from "ags";

export default () => {
	const mic = Wp.get_default()?.audio.defaultMicrophone!;
    const mute = createBinding(mic, "mute");

    return (
        <QSToggle
            className={mute.as((muted) => {
                if (!muted) {
                    return "toggles quick-settings-button active";
                }
                return "toggles quick-settings-button";
            })}
            onPrimaryClick={() => mic.mute = !mic.mute}
            icon={mute.as((muted) => icons.audio.mic[muted ? "muted" : "high"])}
            label={mute.as((muted) => muted ? "Muted" : "Unmuted")}
            hasArrow={false}
        />
    );
}
