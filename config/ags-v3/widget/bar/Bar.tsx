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
import MediaPlayer from "./items/MediaPlayer";
import { Gtk } from "ags/gtk4";

export default function Bar(gdkmonitor: Gdk.Monitor) {
  const widgetMap: Record<BarWidgets, JSX.Element> = {
    Launcher: Launcher(),
    Mpris: Mpris(),
    Taskbar: Taskbar(),
    Workspaces: Workspaces(),
    Clock: Clock(),
    MediaPlayer: MediaPlayer(),
    BluetoothPowerUsage: BluetoothPowerUsage(),
    Tray: Tray(),
    Wireless: Wireless(),
    Battery: Battery(),
    SystemIndicators: SystemIndicators(),
    Powermenu: Powermenu(),
  };

  const renderWidgets = (widgetKeys: BarWidgets[]) => widgetKeys.map(key => widgetMap[key] || null);

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
        <box $type="start">
          <box>
            {renderWidgets(config.barLayout.startLeft)}
          </box>
          <box
            halign={Gtk.Align.END}
            hexpand={true}
          >
            {renderWidgets(config.barLayout.startRight)}
          </box>
        </box>
        <box $type="center">
  				{renderWidgets(config.barLayout.center)}
        </box>
        <box $type="end">
  				{renderWidgets(config.barLayout.endRight)}
        </box>
      </centerbox>
    </window>
  );
}
