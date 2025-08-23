import GLib from "gi://GLib?version=2.0";
import App from "ags/gtk3/app";
import { dateTimeFormat, enableBarDateTime, namespaceDashboard } from "../../common/Variables";
import { createPoll } from "ags/time";

export default () => {
    if (enableBarDateTime === false) {
        return (
            <box visible={false} />
        );
    }

    let format = "%a %b %e   %H:%M:%S";
    if (dateTimeFormat) {
        format = dateTimeFormat;
    }

    const time = createPoll("", 1000, () =>
        GLib.DateTime.new_now_local().format(format)!)

    return <button
        onClicked={() => App.toggle_window(namespaceDashboard)}
        class={"bar-button"}
        label={time}
        $={(self) => {
            const window = App.get_window(namespaceDashboard);
            if (window) {
                window.connect("notify::visible", () => {
                    self.toggleClassName("active", window.visible);
                });
            }
        }}
    />
}
