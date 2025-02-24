import { bind } from "astal";
import { Gtk } from "astal/gtk4";
import Wp from "gi://AstalWp";

export default () => {
    const speaker = Wp.get_default()?.audio.defaultSpeaker!

    return (
        <box cssClasses={["AudioSlider"]}>
			<overlay
                cssClasses={["volume-slider-overlay"]}
            >
                <image
                    cssClasses={["slider-volume-icon"]}
                    iconName={bind(speaker, "volumeIcon")}
                    halign={Gtk.Align.START}
                    hexpand={false}
                    type="overlay"
                />
                <slider
                    hexpand={true}
                    onChangeValue={(self) => {
                        speaker.volume = self.value;

                        if (speaker.volume === 0) {
                            speaker.mute = true;
                        } else if (speaker.mute) {
                            speaker.mute = false;
                        }
                    }}
                    value={bind(speaker, "volume")}
                />
            </overlay>
        </box>
    );
}
