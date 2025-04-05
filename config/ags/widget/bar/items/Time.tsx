import { Variable, GLib } from "astal";
import { App } from "astal/gtk3";
import { dateTimeFormat, enableBarDateTime, namespaceDashboard } from "../../common/Variables";

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

    const time = Variable<string>("").poll(1000, () =>
        GLib.DateTime.new_now_local().format(format)!)

    return <button
        onClicked={() => App.toggle_window(namespaceDashboard)}
        className={"bar-button"}
        onDestroy={() => time.drop()}
        label={time()}
        setup={(self) => {
            const window = App.get_window(namespaceDashboard);
            if (window) {
                self.hook(window, "notify::visible", () => {
                    self.toggleClassName("active", window.visible);
                });
            }
        }}
    />
}
