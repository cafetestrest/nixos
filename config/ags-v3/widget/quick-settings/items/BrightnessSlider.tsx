import { bind } from "ags/state";
import Gtk from "gi://Gtk?version=4.0";
import BrightnessService from "../../../service/BrightnessService";
import icons from "../../../lib/icons";

export default () => {
    if (BrightnessService === null) {
        return (
            <box visible={false} />
        );
    }

    return (
        <box
            cssClasses={["brightness-slider"]}
        >
            <overlay
                cssClasses={["brightness-slider"]}
            >
                <image
                    cssClasses={["slider-brightness-icon"]}
                    iconName={icons.brightness.screen}
                    halign={Gtk.Align.START}
                    hexpand={false}
                    _type="overlay"
                />
                <slider
                    hexpand={true}
                    value={bind(BrightnessService, "screen")}
                    $changeValue={({ value }) => {
                        BrightnessService!.screen = value
                    }}
                />
            </overlay>
        </box>
    );
}
