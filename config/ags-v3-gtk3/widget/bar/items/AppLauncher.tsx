import { Astal, Gtk } from "ags/gtk3";
import App from "ags/gtk3/app";
import { config } from "../../../lib/config";
import GLib from "gi://GLib?version=2.0";

export default () => {
    const defaultIcon = GLib.get_os_info("LOGO") || "system-search-symbolic";

    return (
        <button
            class={"app-launcher-button bar-button"}
            onClicked={() => App.toggle_window(config.applauncher.namespace)}
            halign={Gtk.Align.CENTER}
            $={(self) => {
                const window = App.get_window(config.applauncher.namespace);
                if (window) {
                    window.connect("notify::visible", () => {
                        Astal.widget_toggle_class_name(self, "active", window.visible);
                    });
                }
            }}
        >
            {config.bar.applauncherIcon !== "" ? <label label={config.bar.applauncherIcon}/> : <icon icon={defaultIcon}/>}
        </button>
    );
}
