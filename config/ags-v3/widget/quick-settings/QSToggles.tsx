import { Gtk } from "ags/gtk4";
import NoteToggle from "./items/NoteToggle";
import NightLightToggle from "./items/NightLightToggle";
import IdleToggle from "./items/IdleToggle";
import MicrophoneToggle from "./items/MicrophoneToggle";
import DNDToggle from "./items/DNDToggle";
import ColorPickerToggle from "./items/ColorPickerToggle";

export default () => {
    return (
        <box
            orientation={Gtk.Orientation.VERTICAL}
        >
            <box
                cssClasses={["qs-row"]}
            >
                <NoteToggle />
                <NightLightToggle />
            </box>
            <box
                cssClasses={["qs-row"]}
            >
                <IdleToggle />
                <MicrophoneToggle />
            </box>
            <box
                cssClasses={["qs-row"]}
            >
                <DNDToggle />
                <ColorPickerToggle />
            </box>
        </box>
    );
}
