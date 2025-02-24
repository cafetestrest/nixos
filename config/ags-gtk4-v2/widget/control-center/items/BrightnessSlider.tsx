import { Gtk, hook } from "astal/gtk4";
import Brightness from "../../../service/BrightnessService";
import icons from "../../../lib/icons";
import { hasBrightness } from "../../common/Variables";

const VolumeSlider = ({ device }: { device: Brightness }) => {
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
    hook(scale, device, "notify::screen", () => {
        adjustment.value = device!.screen;
    });

    return scale;
};

export default () => {
    let brightness = null;

    if (hasBrightness) {
        brightness = Brightness.get_default()
    }

    if (hasBrightness) {
        return (
            <box cssClasses={["brightness-slider"]}>
                <overlay
                    cssClasses={["brightness-slider-overlay"]}
                    child={
                        <box>
                            <VolumeSlider device={brightness}/>
                        </box>
                    }
                >
                    <image
                        cssClasses={["slider-brightness-icon"]}
                        iconName={icons.brightness.screen}
                        halign={Gtk.Align.START}
                        hexpand={false}
                        type="overlay"
                    />
                </overlay>
                {/* <slider
                    hexpand={true}
                    onDragged={({ value }) => speaker.volume = value}
                    value={bind(speaker, "volume")}
                /> */}
                {/* //todo add slider instead VolumeSlider */}
            </box>
        );
    } else {
        return (<box visible={false}/>);
    }
}
