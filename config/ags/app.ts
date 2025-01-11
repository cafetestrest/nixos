import { App, Gdk, Gtk } from "astal/gtk3";
import style from "./style/main.scss";
import Bar from "./widget/Bar";
import ControlCenter from "./widget/ControlCenter";
import NotificationsPopup from "./widget/Notifications/NotificationsPopup";
import AppLauncher from "./widget/AppLauncher";
import Notifications from "./widget/Notifications";
import OSD from "./widget/OSD";
import {
	toggleWindow,
	reloadScss,
} from "./lib/utils";
import Scrim from "./widget/Scrims/Scrim";
// import Verification from "./widget/Powermenu/Verification";
import Powermenu from "./widget/Powermenu";
import ScreenRecordService from "./service/ScreenRecord";
import Dashboard from "./widget/Dashboard";
import Weather from "./widget/Dashboard/weather";
import Overview from "./widget/Dashboard/Overview";

function main() {
	const bars = new Map<Gdk.Monitor, Gtk.Widget>();
	const notificationsPopups = new Map<Gdk.Monitor, Gtk.Widget>();
	const osds = new Map<Gdk.Monitor, Gtk.Widget>();

	Notifications();
	ControlCenter();
	AppLauncher();
	Scrim({ scrimType: "opaque", className: "scrim" });
	Scrim({ scrimType: "transparent", className: "transparent-scrim" });
	// Verification();
	Powermenu();
	Dashboard();
	Weather();
	Overview();

	for (const gdkmonitor of App.get_monitors()) {
		bars.set(gdkmonitor, Bar(gdkmonitor));
		notificationsPopups.set(gdkmonitor, NotificationsPopup(gdkmonitor));
		osds.set(gdkmonitor, OSD(gdkmonitor));
	}

	App.connect("monitor-added", (_, gdkmonitor) => {
		bars.set(gdkmonitor, Bar(gdkmonitor));
		notificationsPopups.set(gdkmonitor, NotificationsPopup(gdkmonitor));
		osds.set(gdkmonitor, OSD(gdkmonitor));
	});

	App.connect("monitor-removed", (_, gdkmonitor) => {
		bars.get(gdkmonitor)?.destroy();
		notificationsPopups.get(gdkmonitor)?.destroy();
		osds.get(gdkmonitor)?.destroy();
		bars.delete(gdkmonitor);
		notificationsPopups.delete(gdkmonitor);
		osds.delete(gdkmonitor);
	});

	// reloadScss('.config/ags/style/bar.scss', '/tmp/astal/style.css', '.config/ags/style/main.scss');
	// reloadScss('.config/ags/style/controlCenter.scss', '/tmp/astal/style.css', '.config/ags/style/main.scss');
	// reloadScss('.config/ags/style/player.scss', '/tmp/astal/style.css', '.config/ags/style/main.scss');
	// reloadScss('.config/ags/style/dashboard.scss', '/tmp/astal/style.css', '.config/ags/style/main.scss');
	// reloadScss('.config/ags/style/overview.scss', '/tmp/astal/style.css', '.config/ags/style/main.scss');
	// reloadScss('.config/ags/style/appLauncher.scss', '/tmp/astal/style.css', '.config/ags/style/main.scss');
	// reloadScss('.config/ags/style/notificationsWindow.scss', '/tmp/astal/style.css', '.config/ags/style/main.scss');
	// reloadScss('.config/ags/style/notification.scss', '/tmp/astal/style.css', '.config/ags/style/main.scss');
	// reloadScss('.config/ags/style/weather.scss', '/tmp/astal/style.css', '.config/ags/style/main.scss');
}

// ags config based on https://github.com/PoSayDone/.dotfiles_nix/tree/8647ff23d4522ed1210eb1656580f33f9956dacb
App.start({
	css: style,
	main: main,
	requestHandler(request: string, res: (response: any) => void) {
		const args = request.split(" ");
		if (args[0] == "toggle") {
			toggleWindow(args[1]);
			res("ok");
		} else if (args[0] == "record") {
			if (args[1] == "start") {
				ScreenRecordService.start();
				res("Record started");
			} else if (args[1] == "stop") {
				ScreenRecordService.stop();
				res("Record stopped");
			}
			return res("unknown command");
		} else {
			res("unknown command");
		}
	},
});
