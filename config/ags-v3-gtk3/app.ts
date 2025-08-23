import { Gdk, Gtk } from "ags/gtk3";
import App from "ags/gtk3/app"
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
    overviewEnabled,
    enableBarApplauncher,
    enableBarWeather,
    enableBarNotifications,
    enableDashboard,
    enableNotificationPopups,
    enableOsd,
} from "./widget/common/Variables";
import WeatherPopup from "./widget/weather/WeatherPopup";
import NotificationPopupWindow from "./widget/notifications/NotificationPopupWindow";
import OverviewPopupWindow from "./widget/overview/OverviewPopupWindow";
import { initScss } from "./widget/common/Config";
import { reloadScss } from "./lib/utils";

function main() {
    initScss();

    for (const gdkmonitor of App.get_monitors()) {
      Bar(gdkmonitor)
    }
}

App.start({
  css: style,
  main: main,
})
