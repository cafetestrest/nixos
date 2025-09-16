import { Gtk } from "ags/gtk3";
import Brightness from "../../../service/BrightnessService";
import icons from "../../../lib/icons";

const VolumeSlider = ({ device }: { device: typeof Brightness }) => {
    const adjustment = new Gtk.Adjustment({
        lower: 0,
        upper: 1,
        value: device!.screen,
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
        device!.screen = value;
    });
    scale.connect("notify::screen", () => {
        adjustment.value = device!.screen;
    });

    return scale;
};

export default () => {
    if (Brightness === null) {
        return (
            <box visible={false} />
        );
    }

    return (
        <box class={"brightness-slider"}>
            <overlay
                class={"brightness-slider-overlay"}
            >
                <icon
                    class={"slider-brightness-icon"}
                    icon={icons.brightness.screen}
                    halign={Gtk.Align.START}
                    hexpand={false}
                    $type="overlay"
                />
                <box>
                    <VolumeSlider device={Brightness}/>
                </box>
            </overlay>
            {/* <slider
                hexpand={true}
                onDragged={({ value }) => speaker.volume = value}
                value={bind(speaker, "volume")}
            /> */}
        </box>
    );
}
