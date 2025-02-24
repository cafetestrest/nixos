import { Variable, GLib } from "astal";
import { App } from "astal/gtk4";
import { namespaceDashboard } from "../../common/Variables";

export default ({ format = "%a %b %e   %H:%M:%S" }) => {
    const time = Variable<string>("").poll(1000, () =>
        GLib.DateTime.new_now_local().format(format)!)

    return <button
        onClicked={() => App.toggle_window(namespaceDashboard)}
        cssClasses={["Time", "bar-button"]}
        onDestroy={() => time.drop()}
        label={time()}
        setup={(self) => {
            const window = App.get_window(namespaceDashboard);
            if (window) {
                self[window.visible ? "add_css_class" : "remove_css_class"]("active");
            }
        }}
    />
}
