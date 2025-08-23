import Gtk from "gi://Gtk?version=4.0";
import GLib from "gi://GLib";
import { config } from "../../../lib/config";
import { createPoll } from "ags/time";

export default () => {
    const format = config.bar.dateTimeFormat || "%H:%M";

    const time = createPoll("", 1000, () => {
        return GLib.DateTime.new_now_local().format(format)!
    });

    return (
        <menubutton>
            <label label={time} />
            <popover>
                <Gtk.Calendar />
            </popover>
        </menubutton>
    );
}
