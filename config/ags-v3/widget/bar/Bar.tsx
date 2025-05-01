import app from "ags/gtk4/app";
import Astal from "gi://Astal?version=4.0";
import Gdk from "gi://Gdk?version=4.0";
import Clock from "./items/Clock";
import Launcher from "./items/Launcher";
import Taskbar from "./items/Taskbar";
import Powermenu from "./items/Powermenu";
import Workspaces from "./items/Workspaces";
import Mpris from "./items/Mpris";
import Tray from "./items/Tray";
import Wireless from "./items/Wireless";
import Battery from "./items/Battery";
import BluetoothPowerUsage from "./items/BluetoothPowerUsage";
import SystemIndicators from "./items/SystemIndicators";
import { config, BarWidgets } from "../../lib/config";

const widgetMap: Record<BarWidgets, JSX.Element> = {
  Launcher: Launcher(),
  Mpris: Mpris(),
  Taskbar: Taskbar(),
  Workspaces: Workspaces(),
  Clock: Clock(),
  BluetoothPowerUsage: BluetoothPowerUsage(),
  Tray: Tray(),
  Wireless: Wireless(),
  Battery: Battery(),
  SystemIndicators: SystemIndicators(),
  Powermenu: Powermenu(),
};

const renderWidgets = (widgetKeys: BarWidgets[]) => widgetKeys.map(key => widgetMap[key] || null);

export default function Bar(gdkmonitor: Gdk.Monitor) {
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor;

  return (
    <window
      visible
      name="bar"
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={TOP | LEFT | RIGHT}
      application={app}
    >
      <centerbox>
        <box _type="start">
  				{renderWidgets(config.barLayout.startLeft)}
        </box>
        <box _type="center">
  				{renderWidgets(config.barLayout.center)}
        </box>
        <box _type="end">
  				{renderWidgets(config.barLayout.endRight)}
        </box>
      </centerbox>
    </window>
  );
}
