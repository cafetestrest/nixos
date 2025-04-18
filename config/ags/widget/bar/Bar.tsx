import { Astal, Gtk, Gdk } from "astal/gtk3";
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
import {
	barMarginTop,
	barMarginBottom,
	barMarginLeft,
	barMarginRight,
	barLayoutStartLeft,
	barLayoutStartRight,
	barLayoutCenter,
	barLayoutEndLeft,
	barLayoutEndRight,
} from "../common/Variables";

const widgetMap: Record<string, () => Gtk.Widget> = {
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

const renderWidgets = (widgetKeys: string[]) =>
    widgetKeys.map(key => {
        const widget = widgetMap[key];
        return widget ? widget() : null;
});

const Start = () => {


	return (
		<box>
			<box halign={Gtk.Align.START}>
				{renderWidgets(barLayoutStartLeft)}
			</box>
			<box halign={Gtk.Align.END} hexpand={true}>
				{renderWidgets(barLayoutStartRight)}
			</box>
		</box>
	);
};

const Center = () => {
	return (
		<box>
			{renderWidgets(barLayoutCenter)}
		</box>
	);
};

const End = ({powermenu, systemIndicators}) => {
	widgetMap.powermenu = () => powermenu;
    widgetMap.systemIndicators = () => systemIndicators;

	return (
		<box>
			<box halign={Gtk.Align.START}>
				{renderWidgets(barLayoutEndLeft)}
			</box>
			<box halign={Gtk.Align.END} hexpand={true}>
				{renderWidgets(barLayoutEndRight)}
			</box>
		</box>
	);
};

export default function Bar(monitor: Gdk.Monitor) {
    const { TOP, LEFT, RIGHT } = Astal.WindowAnchor

    const _qsPagePopover = (<QuickSettingsPopover/>);
    const _powermenuPopover = (<PowermenuPopover/>);
    const powermenuButton = (<PowermenuButton/>);
    const sysIndicatorsButton = (<SystemIndicatorsButton/>);

    return <window
        className={"bar"}
        namespace={"bar"}
        name={"bar"}
        gdkmonitor={monitor}
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        anchor={TOP | LEFT | RIGHT}
		marginTop={barMarginTop}
		marginBottom={barMarginBottom}
		marginLeft={barMarginLeft}
		marginRight={barMarginRight}
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
