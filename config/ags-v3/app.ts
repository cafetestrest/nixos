import app from "ags/gtk4/app";
import style from "./style/main.scss";
import Bar from "./widget/bar/Bar";
import Applauncher from "./widget/app-launcher/Applauncher";
import GLib from "gi://GLib";
import Gtk from "gi://Gtk?version=4.0";
import { config } from "./lib/config";
import QSMain from "./widget/quick-settings/QSMain";
import { reloadScss } from "./lib/utils";

let applauncher: Gtk.Window
let quickSettings: Gtk.Window

app.start({
    css: style,
    // gtkTheme: "Adwaita",
    requestHandler(request, res) {
        const [, argv] = GLib.shell_parse_argv(request)
        if (!argv) return res("argv parse error")

        if (argv[0] != "toggle" || !argv[1]) {
            return res("unknown command")
        }

        switch (argv[1]) {
            case "app-launcher":
            case "launcher":
                applauncher.visible = !applauncher.visible
                return res("ok")
            case "control-center":
            case "quicksettings":
                quickSettings.visible = !quickSettings.visible
            default:
                return res("unknown command")
        }
    },
    main() {
        if (config.applauncher.enabled) {
            applauncher = Applauncher() as Gtk.Window;
            app.add_window(applauncher);
            // applauncher.present();
        }

        quickSettings = QSMain() as Gtk.Window;
        app.add_window(quickSettings);

        // reloadScss('style/bar.scss', '/tmp/astal/style.css', 'style/main.scss');
        reloadScss('style/quick-settings.scss', '/tmp/astal/style.css', 'style/main.scss');

        app.get_monitors().map(Bar);
    },
})
