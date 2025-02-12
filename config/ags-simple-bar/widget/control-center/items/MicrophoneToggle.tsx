import { bind } from "astal"
import icons from "../../../lib/icons";
import Wp from "gi://AstalWp";
import QSToggle from "./QSToggle";

export default () => {
	const mic = Wp.get_default()?.audio.defaultMicrophone!;
    const mute = bind(mic, "mute");

    return (
        <QSToggle
            className={bind(mute.as((muted) => {
                if (!muted) {
                    return "toggles control-center-button active";
                }
                return "toggles control-center-button";
            }))}
            onPrimaryClick={() => mic.mute = !mic.mute}
            icon={mute.as((muted) => icons.audio.mic[muted ? "muted" : "high"])}
            label={mute.as((muted) => muted ? "Muted" : "Unmuted")}
            hasArrow={false}
        />
    );
}
