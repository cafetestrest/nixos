import { Gtk, hook } from "astal/gtk3";
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
            <box className={"brightness-slider"}>
                <overlay
                    className={"brightness-slider-overlay"}
                    overlay={
                        <icon
                            className={"slider-brightness-icon"}
                            icon={icons.brightness.screen}
                            halign={Gtk.Align.START}
                            hexpand={false}
                        />
                    }
                    child={
                        <box>
                            <VolumeSlider device={brightness}/>
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
    } else {
        return (<box visible={false}/>);
    }
}
