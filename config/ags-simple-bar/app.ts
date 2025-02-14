import { App, Gdk, Gtk } from "astal/gtk3";
import style from "./style/main.scss";
import Bar from "./widget/bar/Bar"
import Applauncher from "./widget/app-launcher/Applauncher";
import OSD from "./widget/osd/OSD";
import NotificationPopups from "./widget/notifications/NotificationPopups";
import Dashboard from "./widget/dashboard/Dashboard";
import { visibleQSMainPage, visiblePowermenu } from "./widget/common/Variables";
import { reloadScss } from "./lib/utils";
import WeatherPopup from "./widget/weather/WeatherPopup";

function main() {
	const bars = new Map<Gdk.Monitor, Gtk.Widget>();
	const notificationsPopups = new Map<Gdk.Monitor, Gtk.Widget>();
	const osds = new Map<Gdk.Monitor, Gtk.Widget>();

    Applauncher();
    Dashboard();
    WeatherPopup();

    // reloadScss('style/bar.scss', '/tmp/astal/style.css', 'style/main.scss');
    // reloadScss('style/common.scss', '/tmp/astal/style.css', 'style/main.scss');
    // reloadScss('style/control-center.scss', '/tmp/astal/style.css', 'style/main.scss');
    // reloadScss('style/osd.scss', '/tmp/astal/style.css', 'style/main.scss');
    // reloadScss('style/powermenu.scss', '/tmp/astal/style.css', 'style/main.scss');
    reloadScss('style/app-launcher.scss', '/tmp/astal/style.css', 'style/main.scss');
    // reloadScss('style/workspaces.scss', '/tmp/astal/style.css', 'style/main.scss');

    for (const gdkmonitor of App.get_monitors()) {
		bars.set(gdkmonitor, Bar(gdkmonitor));
		notificationsPopups.set(gdkmonitor, NotificationPopups(gdkmonitor));
		osds.set(gdkmonitor, OSD(gdkmonitor));
	}
}

App.start({
    css: style,
    instanceName: "js",
    requestHandler(request: string, res: (response: any) => void) {
		const args = request.split(" ");
		if (args[0] == "toggle" && args[1]) {
            switch (args[1]) {
                case "control-center":
                case "quicksettings":
                    visibleQSMainPage.set(!visibleQSMainPage.get());
                    break;
            
                case "powermenu":
                    visiblePowermenu.set(!visiblePowermenu.get());
                    break;
                default:
                    print("Unknown request:", request);
                    return res("Unknown request")
            }
            return res("ok");
        } else {
            return res("Unknown request");
        }

        print(request);
        res("ok");
    },
    main: main,
})
