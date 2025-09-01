import { createBinding, For, This } from "ags"
import app from "ags/gtk3/app"
import style from "./style/main.scss";
import Bar from "./widget/bar/Bar";
import Applauncher from "./widget/app-launcher/Applauncher";
import OSD from "./widget/osd/OSD";
import NotificationPopups from "./widget/notifications/NotificationPopups";
import Dashboard from "./widget/dashboard/Dashboard";
import {
  visibleQSMainPage,
  setVisibleQSMainPage,
  visiblePowermenu,
  setVisiblePowermenu,
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

  if (enableBarApplauncher) {
    Applauncher();
  }

  if (enableBarWeather) {
    WeatherPopup();
  }

  if (enableBarNotifications) {
    NotificationPopupWindow();
  }

  if (overviewEnabled) {
    OverviewPopupWindow();
  }

  if (enableDashboard) {
    Dashboard();
  }

  const monitors = createBinding(app, "monitors")

  return (
    <For each={monitors}>
      {(monitor) => {
        return (
        <This this={app}>
          {Bar(monitor)}
          {enableNotificationPopups ? NotificationPopups() : null}
          {enableOsd ? OSD(monitor) : null}
        </This>
      )}}
    </For>
  );
}

app.start({
  css: style,
  requestHandler(argv: string[], res: (response: any) => void) {
    argv.forEach((request) => {
      const args = request.split(" ");
      if (args[0] == "toggle" && args[1]) {
        switch (args[1]) {
            case "app-launcher":
            case "launcher":
                app.toggle_window(namespaceApplauncher);
                break;
            case "control-center":
            case "quicksettings":
                setVisibleQSMainPage(!visibleQSMainPage.get());
                break;
            case "notifications":
            case "notification":
                app.toggle_window(namespaceNotification);
                break;
            case "powermenu":
                setVisiblePowermenu(!visiblePowermenu.get());
                break;
            case "weather":
                app.toggle_window(namespaceWeather);
                break;
            default:
                print("Unknown request:", request);
                return res("Unknown request")
        }
        return res("ok");
      } else {
        return res("Unknown request");
      }
    })
  },
  main: main,
})
