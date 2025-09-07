import GLib from "gi://GLib?version=2.0";
import App from "ags/gtk3/app";
import { createPoll } from "ags/time";
import { Astal } from "ags/gtk3";
import { config } from "../../../lib/config";

export default () => {
    let format = "%a %b %e   %H:%M:%S";
    if (config.bar.dateTimeFormat) {
        format = config.bar.dateTimeFormat;
    }

    const time = createPoll("", 1000, () =>
        GLib.DateTime.new_now_local().format(format)!)

    return <button
        onClicked={() => App.toggle_window(config.dashboard.namespace)}
        class={"bar-button"}
        label={time}
        $={(self) => {
            const window = App.get_window(config.dashboard.namespace);
            if (window) {
                window.connect("notify::visible", () => {
                    Astal.widget_toggle_class_name(self, "active", window.visible);
                });
            }
        }}
    />
}
