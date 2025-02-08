import { bind } from "astal"
import icons from "../../../lib/icons";
import { Gtk } from "astal/gtk3";
import Wp from "gi://AstalWp";
import { referenceWord, padLength } from "../../common/Variables";

export default () => {
	const mic = Wp.get_default()?.audio.defaultMicrophone!;
    const mute = bind(mic, "mute");
    const hasArrow = false;

    return (
        <button
            className={bind(mute.as((muted) => {
                if (!muted) {
                    return "toggles control-center-button active";
                }
                return "toggles control-center-button";
            }))}
            onClicked={() => mic.mute = !mic.mute}
        >
            <box
                halign={Gtk.Align.FILL}
            >
                <icon
                    icon={mute.as((muted) => icons.audio.mic[muted ? "muted" : "high"])}
                />
                <label
                    halign={Gtk.Align.START}
                    label={mute.as((muted) => muted ? padLength(referenceWord, "Muted") : padLength(referenceWord, "Unmuted"))}
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
