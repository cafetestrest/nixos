import { Accessor } from "ags";
import Bluetooth from "gi://AstalBluetooth";
import AstalNetwork from "gi://AstalNetwork";
import AstalHyprland from "gi://AstalHyprland";
import { Astal } from "ags/gtk3";

export type BarWidgets =
    | "AppLauncher"
    | "Taskbar"
    | "Workspaces"
    | "Media"
    | "Time"
    | "WeatherButton"
    | "NotificationsRevealerButton"
    | "RecordingIndicatorButton"
    | "UsageBox"
    | "BarButtons"
    | "SysTray"
    | "SystemIndicatorsButton"
    | "PowermenuButton"
    | "BatteryLevel"

export type PowermenuWidgets =
    | "lock"
    | "sleep"
    | "logout"
    | "reboot"
    | "shutdown"

export type QuickSettingsWidgets =
    | "QSToggles"
    | "AudioSliderBox"
    | "BrightnessSliderBox"
    | "SinkMenu"
    | "WeatherSchedule"
    | "MediaPlayer"

export type BarUsageWidgets =
    | "Cpu"
    | "Ram"
    | "Disk"
    | "BluetoothPower"

export type BarSystemIndicators =
    | "DND"
    | "Idle"
    | "Nightlight"
    | "PowerProfile"
    | "Bluetooth"
    | "Network"
    | "MicMute"
    | "Audio"

export type BarButtons =
    | "NoteButton"
    | "ScreenshotButton"
    | "ColorPickerButton"

export type ConfigSourceDeepPartial<T> = {
    [K in keyof T]?: T[K] extends object ? ConfigSourceDeepPartial<T[K]> : T[K];
};

export const DARK = "dark";
export const LIGHT = "light";
export type ThemeMode = typeof DARK | typeof LIGHT;

export type PowerMenuAction = "lock" | "sleep" | "logout" | "reboot" | "shutdown";

export type TooltipItem = {
      date: string;
      hour: string;
      temperature: string;
      icon: string;
      wind: string;
      rain: string;
      humidity: string;
      minTemp: string;
      maxTemp: string;
      indicator: string;
};

export type IconTemperatureData = {
    minTemp: number;
    maxTemp: number;
    rain: number;
    icons: string[];
    widgetsNumber: number;
    data: TooltipItem[];
};

export type TemperatureData = {
	minTemp: number;
	maxTemp: number;
	rain: number;
	icons: string[];
	widgetsNumber: number;
	data: TooltipItem[];
};

export type SystemIndicatorsType = {
	className: string | Accessor<string>;
	onClicked: () => void;
}

export type QSToggleProps = JSX.IntrinsicElements["button"] & {
    icon: string | Accessor<string> | undefined;
    className?: Accessor<any> | string;
    onPrimaryClick?: () => void;
    hasArrow?: boolean;
    arrowIcon?: string | Accessor<string> | undefined;
    revelaer?: string;
}

export type TogglesType = Record<string, JSX.Element>;

export type DeviceItemProps = {
	device: Bluetooth.Device;
};

export type NetworkPageProps = {
    network: AstalNetwork.Network;
    wifi: AstalNetwork.Wifi;
};

export type PageProps = {
	label: string;
	child?: JSX.Element;
	refresh?: () => void;
};

export type Day = {
	day: string;
	today: number;
};

export type WorkspaceType = {
  workspace: AstalHyprland.Workspace;
  hyprland: AstalHyprland.Hyprland;
}

export type PopoverProps = Pick<
  JSX.IntrinsicElements["window"],
  | "class"
  | "name"
  | "namespace"
  | "visible"
  | "marginBottom"
  | "marginTop"
  | "marginLeft"
  | "marginRight"
  | "halign"
  | "valign"
> & {
  onClose?(self: Astal.Window): void
  child: JSX.Element
  className: string;
}

export type PopoverCenterProps = Pick<
  JSX.IntrinsicElements["window"],
  "name" | "namespace" | "class" | "visible"
> & {
  onClose?(self: Astal.Window): void
  child?: JSX.Element
}

export type PowermenuButtonProps = JSX.IntrinsicElements["button"] & {
    action: PowerMenuAction;
	iconName: string;
}
