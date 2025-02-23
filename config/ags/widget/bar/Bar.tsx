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

const Start = () => {
	return (
		<box>
			<box halign={Gtk.Align.START}>
				<AppLauncher />
				<Taskbar />
				<Workspaces />
			</box>
			<box halign={Gtk.Align.END} hexpand={true}>
                <Media />
			</box>
		</box>
	);
};

const Center = () => {
	return (
		<box>
			<Time />
		</box>
	);
};

const End = ({powermenu, systemIndicators}) => {
	return (
		<box>
			<box halign={Gtk.Align.START}>
				<WeatherButton />
				<NotificationsRevealerButton />
			</box>
			<box halign={Gtk.Align.END} hexpand={true}>
				<box className={"recording-box"}>
					<RecordingIndicatorButton />
				</box>
				<UsageBox />
				<BarButtons />
                <SysTray />
                {/* <BatteryLevel /> */}
                {systemIndicators}
                {powermenu}
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
        className={"Bar"}
        namespace={"bar"}
        gdkmonitor={monitor}
        exclusivity={Astal.Exclusivity.EXCLUSIVE}
        anchor={TOP | LEFT | RIGHT}>
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
