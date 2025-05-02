import AstalWp from "gi://AstalWp";
import { bind } from "ags/state";
import Gtk from "gi://Gtk?version=4.0";

export default () => {
    const { defaultSpeaker: speaker } = AstalWp.get_default()!;

    return (
        <box
            cssClasses={["audio-slider"]}
        >
            <overlay
                cssClasses={["volume-slider-overlay"]}
            >
                <image
                    cssClasses={["slider-volume-icon"]}
                    iconName={bind(speaker, "volumeIcon")}
                    halign={Gtk.Align.START}
                    hexpand={false}
                    _type="overlay"
                />
                <slider
                    hexpand={true}
                    value={bind(speaker, "volume")}
                    $changeValue={({ value }) => {
                        speaker.set_volume(value)

                        if (speaker.volume === 0) {
                            speaker.mute = true;
                        } else if (speaker.mute) {
                            speaker.mute = false;
                        }
                    }}
                />
            </overlay>
        </box>
    );
}
