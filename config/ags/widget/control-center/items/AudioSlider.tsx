import { bind } from "astal"
import { Gtk, hook } from "astal/gtk3";
import Wp from "gi://AstalWp"

const VolumeSlider = ({ device }: { device: Wp.Endpoint }) => {
    const adjustment = new Gtk.Adjustment({
        lower: 0,
        upper: 1,
        value: device.volume,
        stepIncrement: 0.01,
        pageIncrement: 0.01,
    });
    const scale = new Gtk.Scale({
        adjustment,
        hexpand: true,
        visible: true,
        draw_value: false,
    });
    scale.connect("change-value", (_, type, value) => {
        value = Math.round(Math.max(0, Math.min(value * 100, 100))) / 100;
        device.volume = value;
    });
    hook(scale, device, "notify::volume", () => {
        const volume = device.volume;
        if (Math.abs(adjustment.value - volume) > 0.001) {
            adjustment.value = volume;
        }

        if (volume === 0) {
            device.mute = true;
        } else if (device.mute) {
            device.mute = false;
        }
    });

    return scale;
};

export default () => {
    const speaker = Wp.get_default()?.audio.defaultSpeaker!

    return (
        <box className={"AudioSlider"}>
			<overlay
                className={"volume-slider-overlay"}
                overlay={
                    <icon
                        className={"slider-volume-icon"}
                        icon={bind(speaker, "volumeIcon")}
						halign={Gtk.Align.START}
                        hexpand={false}
                    />
                }
                child={
                    <box>
                        <VolumeSlider device={speaker} />
                    </box>
                }
            />
            {/* <slider
                hexpand
                onDragged={({ value }) => speaker.volume = value}
                value={bind(speaker, "volume")}
            /> */}
        </box>
    );
}
