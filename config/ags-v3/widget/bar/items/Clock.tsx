import Gtk from "gi://Gtk?version=4.0";
import GLib from "gi://GLib";
import { Poll } from "ags/state";
import { config } from "../../../lib/config";

export default () => {
    const format = config.bar.dateTimeFormat || "%H:%M";

    const time = new Poll("", 1000, () => {
        return GLib.DateTime.new_now_local().format(format)!
    });

    return (
        <menubutton>
            <label $destroy={() => time.destroy()} label={time()} />
            <popover>
                <Gtk.Calendar />
            </popover>
        </menubutton>
    );
}
