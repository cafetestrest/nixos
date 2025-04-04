import { App, Gdk, Gtk } from "astal/gtk3";
import style from "./style/main.scss";
import Bar from "./widget/bar/Bar";
import Applauncher from "./widget/app-launcher/Applauncher";
import OSD from "./widget/osd/OSD";
import NotificationPopups from "./widget/notifications/NotificationPopups";
import Dashboard from "./widget/dashboard/Dashboard";
import {
    visibleQSMainPage,
    visiblePowermenu,
    namespaceApplauncher,
    namespaceNotification,
    namespaceWeather,
    overviewEnabled
} from "./widget/common/Variables";
import { reloadScss } from "./lib/utils";
import WeatherPopup from "./widget/weather/WeatherPopup";
import NotificationPopupWindow from "./widget/notifications/NotificationPopupWindow";
import OverviewPopupWindow from "./widget/overview/OverviewPopupWindow";
import { initScss } from "./widget/common/Config";

function main() {
    initScss();

	const bars = new Map<Gdk.Monitor, Gtk.Widget>();
	const notificationsPopups = new Map<Gdk.Monitor, Gtk.Widget>();
	const osds = new Map<Gdk.Monitor, Gtk.Widget>();

    Applauncher();
    Dashboard();
    WeatherPopup();
    NotificationPopupWindow();

    if (overviewEnabled) {
        OverviewPopupWindow();
    }

    // reloadScss('style/bar.scss', '/tmp/astal/style.css', 'style/main.scss');
    // reloadScss('style/common.scss', '/tmp/astal/style.css', 'style/main.scss');
    // reloadScss('style/control-center.scss', '/tmp/astal/style.css', 'style/main.scss');
    // reloadScss('style/osd.scss', '/tmp/astal/style.css', 'style/main.scss');
    // reloadScss('style/powermenu.scss', '/tmp/astal/style.css', 'style/main.scss');
    // reloadScss('style/app-launcher.scss', '/tmp/astal/style.css', 'style/main.scss');
    // reloadScss('style/dashboard.scss', '/tmp/astal/style.css', 'style/main.scss');
    // reloadScss('style/notification.scss', '/tmp/astal/style.css', 'style/main.scss');
    // reloadScss('style/overview.scss', '/tmp/astal/style.css', 'style/main.scss');
    // reloadScss('style/workspaces.scss', '/tmp/astal/style.css', 'style/main.scss');

    for (const gdkmonitor of App.get_monitors()) {
		bars.set(gdkmonitor, Bar(gdkmonitor));
		notificationsPopups.set(gdkmonitor, NotificationPopups(gdkmonitor));
		osds.set(gdkmonitor, OSD(gdkmonitor));
	}

    App.connect("monitor-added", (_, gdkmonitor) => {
        console.log("monitor added");
		bars.set(gdkmonitor, Bar(gdkmonitor));
		notificationsPopups.set(gdkmonitor, NotificationPopups(gdkmonitor));
		osds.set(gdkmonitor, OSD(gdkmonitor));
	});

	App.connect("monitor-removed", (_, gdkmonitor) => {
        console.log("monitor removed");

		bars.get(gdkmonitor)?.destroy();
		bars.delete(gdkmonitor);

        notificationsPopups.get(gdkmonitor)?.destroy();
		notificationsPopups.delete(gdkmonitor);

        osds.get(gdkmonitor)?.destroy();
		osds.delete(gdkmonitor);
	});
}

App.start({
    css: style,
    // instanceName: "js",
    requestHandler(request: string, res: (response: any) => void) {
		const args = request.split(" ");
		if (args[0] == "toggle" && args[1]) {
            switch (args[1]) {
                case "app-launcher":
                case "launcher":
                    App.toggle_window(namespaceApplauncher);
                    break;
                case "control-center":
                case "quicksettings":
                    visibleQSMainPage.set(!visibleQSMainPage.get());
                    break;
                case "notifications":
                case "notification":
                    App.toggle_window(namespaceNotification);
                    break;
                case "powermenu":
                    visiblePowermenu.set(!visiblePowermenu.get());
                    break;
                case "weather":
                    App.toggle_window(namespaceWeather);
                    break;
                default:
                    print("Unknown request:", request);
                    return res("Unknown request")
            }
            return res("ok");
        } else {
            return res("Unknown request");
        }
    },
    main: main,
})
