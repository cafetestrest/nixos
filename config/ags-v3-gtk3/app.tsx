import { createBinding, For, This } from "ags"
import app from "ags/gtk3/app"
import style from "./style/main.scss";
import Bar from "./widget/bar/Bar";
import Applauncher from "./widget/app-launcher/Applauncher";
import OSD from "./widget/osd/OSD";
import NotificationPopups from "./widget/notifications/NotificationPopups";
import Dashboard from "./widget/dashboard/Dashboard";
import {
  config,
  setVisiblePowermenu,
  visiblePowermenu,
  setVisibleQSMainPage,
  visibleQSMainPage,
} from "./lib/config";
import WeatherPopup from "./widget/weather/WeatherPopup";
import NotificationPopupWindow from "./widget/notifications/NotificationPopupWindow";
import OverviewPopupWindow from "./widget/overview/OverviewPopupWindow";
import { initScss } from "./lib/config";
import { reloadScss } from "./lib/utils";

function main() {
  initScss();

  if (config.applauncher.enabled) {
    Applauncher();
  }

  if (config.weather.enabled) {
    WeatherPopup();
  }

  if (config.notificationPopupWindow.enabled) {
    NotificationPopupWindow();
  }

  if (config.overview.enabled) {
    OverviewPopupWindow();
  }

  if (config.dashboard.enabled) {
    Dashboard();
  }

  const monitors = createBinding(app, "monitors")

  return (
    <For each={monitors}>
      {(monitor) => {
        return (
        <This this={app}>
          {Bar(monitor)}
          {config.notificationPopupWindow.enableNotificationPopups ? NotificationPopups() : null}
          {config.osd.enabled ? OSD(monitor) : null}
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
      if (!args) return res("args parse error")

      if (args[0] != "toggle" || !args[1]) {
          return res("unknown command")
      }

      switch (args[1]) {
          case "app-launcher":
          case "launcher":
              app.toggle_window(config.applauncher.namespace);
              break;
          case "control-center":
          case "quicksettings":
              setVisibleQSMainPage(!visibleQSMainPage.get());
              break;
          case "notifications":
          case "notification":
              app.toggle_window(config.notificationPopupWindow.namespaceNotification);
              break;
          case "powermenu":
              setVisiblePowermenu(!visiblePowermenu.get());
              break;
          case "weather":
              app.toggle_window(config.weather.namespaceWeather);
              break;
          default:
              print("Unknown request:", request);
              return res("Unknown request")
      }
      return res("ok");
    })
  },
  main: main,
  // gtkTheme: "Adwaita",
})
