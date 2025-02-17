import { bind } from "astal"
import { Astal, Gtk, Gdk } from "astal/gtk3"
import PopoverCenter from "../popovers/PopoverCenter"
import Popover from "../popovers/Popover"
import Powermenu from "../powermenu/Powermenu"
import SystemIndicators from "./items/SystemIndicators"
import Taskbar from "./items/Taskbar"
import icons from "../../lib/icons"
import Workspaces from "./items/Workspaces"
import Time from "./items/Time"
// import BatteryLevel from "./items/BatteryLevel"
import SysTray from "./items/SysTray"
import Media from "./items/Media"
import AppLauncher from "./items/AppLauncher"
import ControlCenter from "../control-center/ControlCenter"
import {
    visibleQSMainPage,
    visiblePowermenu,
    barUsageSpacing,
} from "../common/Variables"
import CpuUsage from "../usage/CpuUsage"
import RamUsage from "../usage/RamUsage"
import DiskUsage from "../usage/DiskUsage"
import WeatherButton from "./items/WeatherButton"
import NoteButton from "./items/NoteButton"
import ScreenshotButton from "./items/ScreenshotButton"
import ColorPickerButton from "./items/ColorPickerButton"
import { bash } from "../../lib/utils"
import NotificationsRevealerButton from "./items/NotificationsRevealerButton"
import BluetoothPowerUsage from "../usage/BluetoothPowerUsage"
import RecordingIndicatorButton from "./items/RecordingIndicatorButton"

const Start = () => {
	return (
		<box>
			<box halign={Gtk.Align.START}>
				<AppLauncher />
				<Taskbar />
				<Workspaces />
			</box>
			<box halign={Gtk.Align.END} hexpand>
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
			<box halign={Gtk.Align.END} hexpand>
				<box className={"recording-box"}>
					<RecordingIndicatorButton />
				</box>
				<box className={"usage-box"} spacing={barUsageSpacing}>
					<CpuUsage />
					<RamUsage />
					<DiskUsage />
					<BluetoothPowerUsage />
				</box>
                <box className={"bar-buttons"}>
    				<NoteButton />
                    <ScreenshotButton />
				    <ColorPickerButton />
                </box>
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

    const _qsPagePopover = (
        <Popover
            name={"quicksettings"}
            namespace={"control-center"}
            className={"Popup"}
            onClose={() => {
                visibleQSMainPage.set(false);
            }}
            visible={visibleQSMainPage()}
            marginTop={38}
            marginRight={12}
            valign={Gtk.Align.START}
            halign={Gtk.Align.END}
        >
            <box className={"popup"} vertical>
                {/* maxWidthChars is needed to make wrap work */}
                {/* <label label={"lorem2"} wrap maxWidthChars={8} />
                <button onClicked={() => visibleQSMainPage.set(false)}>
                    Click me to close the popup
                </button> */}
                <ControlCenter/>
            </box>
        </Popover>
    );

    const _powermenuPopover = (
        <PopoverCenter
            name={"powermenu"}
            namespace={"powermenu"}
            className={"Popup"}
            onClose={() => visiblePowermenu.set(false)}
            visible={visiblePowermenu()}
        >
            <box className={"popup"} vertical>
                {/* maxWidthChars is needed, wrap will work as intended */}
                <Powermenu onClicked={() => visiblePowermenu.set(false)} />
            </box>
        </PopoverCenter>
    );

    const powermenuButton = (
        <button
    		className={bind(visiblePowermenu).as((v) => {
                if (v) {
                    return "powermenu-button bar-button active";
                }
                return "powermenu-button bar-button";
            })}
            onClickRelease={(_, event: Astal.ClickEvent) => {
                switch (event.button) {
                    case Gdk.BUTTON_PRIMARY:
                        visiblePowermenu.set(true);
                        break;
                    case Gdk.BUTTON_SECONDARY:
                        bash('openstartupapps');
                        break;
                    case Gdk.BUTTON_MIDDLE:
                        bash('openstartupapps');
                        break;
                }
            }}
        >
            <box>
    			<icon icon={icons.powermenu.shutdown} />
            </box>
        </button>
    );

    const sysIndicatorsButton = (
        <SystemIndicators className={bind(visibleQSMainPage).as((v) => {
            if (v) {
                return "system-indicators bar-button active";
            }
            return "system-indicators bar-button";
        })} onClicked={() => visibleQSMainPage.set(true)}/>
    );

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
