import { Gtk } from "ags/gtk4";
import QSToggles from "./QSToggles";

export default () => {
    return (
        <box
            cssClasses={["quick-settings"]}
            orientation={Gtk.Orientation.VERTICAL}
        >
            <QSToggles/>
            {/* todo remove this if unused */}
        </box>
    );
}
