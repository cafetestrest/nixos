import { App, Gdk, Gtk } from "astal/gtk3";
import style from "./style/main.scss";
import Bar from "./widget/bar/Bar"
import Applauncher from "./widget/app-launcher/Applauncher";
import OSD from "./widget/osd/OSD";
import NotificationPopups from "./widget/notifications/NotificationPopups";
import Dashboard from "./widget/dashboard/Dashboard";

function main() {
	const bars = new Map<Gdk.Monitor, Gtk.Widget>();
	const notificationsPopups = new Map<Gdk.Monitor, Gtk.Widget>();
	const osds = new Map<Gdk.Monitor, Gtk.Widget>();

    Applauncher();
    Dashboard();

    for (const gdkmonitor of App.get_monitors()) {
		bars.set(gdkmonitor, Bar(gdkmonitor));
		notificationsPopups.set(gdkmonitor, NotificationPopups(gdkmonitor));
		osds.set(gdkmonitor, OSD(gdkmonitor));
	}
}

App.start({
    css: style,
    instanceName: "js",
    requestHandler(request, res) {
        print(request)
        res("ok")
    },
    main: main,
})
