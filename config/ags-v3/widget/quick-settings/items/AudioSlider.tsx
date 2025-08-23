import AstalWp from "gi://AstalWp";
import Gtk from "gi://Gtk?version=4.0";
import { createBinding } from "ags";

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
                    iconName={createBinding(speaker, "volumeIcon")}
                    halign={Gtk.Align.START}
                    hexpand={false}
                    $type="overlay"
                />
                <slider
                    hexpand={true}
                    value={createBinding(speaker, "volume")}
                    onValueChanged={({ value }) => {
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
