import app from "ags/gtk4/app";
import style from "./style/main.scss";
import Bar from "./widget/bar/Bar";
import Applauncher from "./widget/app-launcher/Applauncher";
import GLib from "gi://GLib";
import Gtk from "gi://Gtk?version=4.0";
import { config } from "./lib/config";

let applauncher: Gtk.Window

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
            default:
                return res("unknown command")
        }
    },
    main() {
        if (config.applauncher.enabled) {
            applauncher = Applauncher() as Gtk.Window
            app.add_window(applauncher)
            // applauncher.present()            
        }

        app.get_monitors().map(Bar)
    },
})
