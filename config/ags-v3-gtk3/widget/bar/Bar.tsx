import { Astal, Gtk, Gdk } from "ags/gtk3";
import { onCleanup } from "ags";
import Taskbar from "./items/Taskbar";
import Workspaces from "./items/Workspaces";
import Time from "./items/Time";
// import BatteryLevel from "./items/BatteryLevel";
import SysTray from "./items/SysTray";
import Media from "./items/Media";
import AppLauncher from "./items/AppLauncher";
import WeatherButton from "./items/WeatherButton";
import NotificationsRevealerButton from "./items/NotificationsRevealerButton";
import RecordingIndicatorButton from "./items/RecordingIndicatorButton";
import QuickSettingsPopover from "./items/QuickSettingsPopover";
import PowermenuPopover from "./items/PowermenuPopover";
import PowermenuButton from "./items/PowermenuButton";
import SystemIndicatorsButton from "./items/SystemIndicatorsButton";
import BarButtons from "./items/BarButtons";
import UsageBox from "./items/UsageBox";
import { config, BarWidgets } from "../../lib/config";

const widgetMap: Record<BarWidgets, () => JSX.Element> = {
    AppLauncher,
    Taskbar,
    Workspaces,
    Media,
    Time,
    WeatherButton,
    NotificationsRevealerButton,
    RecordingIndicatorButton,
    UsageBox,
    BarButtons,
    SysTray,
};

const renderWidgets = (widgetKeys: BarWidgets[]) =>
    widgetKeys.map(key => {
        const widget = widgetMap[key];
        return widget ? widget() : null;
});

const Start = () => {
	return (
		<box $type="start">
			<box halign={Gtk.Align.START}>
				{renderWidgets(config.barLayout.startLeft)}
			</box>
			<box halign={Gtk.Align.END} hexpand={true}>
				{renderWidgets(config.barLayout.startRight)}
			</box>
		</box>
	);
};

const Center = () => {
	return (
		<box $type="center">
			{renderWidgets(config.barLayout.center)}
		</box>
	);
};

type EndWidgetType = {
	powermenu: JSX.Element
	systemIndicators: JSX.Element
}

const End = ({powermenu, systemIndicators}: EndWidgetType) => {
	widgetMap.powermenu = () => powermenu;
    widgetMap.systemIndicators = () => systemIndicators;

	return (
		<box $type="end">
			<box halign={Gtk.Align.START}>
				{renderWidgets(config.barLayout.endLeft)}
			</box>
			<box halign={Gtk.Align.END} hexpand={true}>
				{renderWidgets(config.barLayout.endRight)}
			</box>
		</box>
	);
};

export default function Bar(monitor: Gdk.Monitor) {
	let win: Astal.Window;
    const { TOP, LEFT, RIGHT } = Astal.WindowAnchor;

	onCleanup(() => {
		// Root components (windows) are not automatically destroyed.
		// When the monitor is disconnected from the system, this callback
		// is run from the parent <For> which allows us to destroy the window
		win.destroy()
	});

    const _qsPagePopover = (<QuickSettingsPopover/>);
    const _powermenuPopover = (<PowermenuPopover/>);
    const powermenuButton = (<PowermenuButton/>);
    const sysIndicatorsButton = (<SystemIndicatorsButton/>);

    return <window
		$={(self) => (win = self)}
        class={"bar"}
        namespace={"bar"}
		name={`bar-${monitor.connector}`}
        gdkmonitor={monitor}
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        anchor={TOP | LEFT | RIGHT}
		marginTop={config.bar.marginTop}
		marginBottom={config.bar.marginBottom}
		marginLeft={config.bar.marginLeft}
		marginRight={config.bar.marginRight}
	>
        <centerbox>
            <Start />
            <Center/>
            <End
                powermenu={powermenuButton}
                systemIndicators={sysIndicatorsButton}
            />
        </centerbox>
    </window>
}
