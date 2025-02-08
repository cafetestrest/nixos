import { App } from "astal/gtk3"
import { Variable, bind } from "astal"
import { Astal, Gtk, Gdk } from "astal/gtk3"
import PopoverCenter from "../popovers/PopoverCenter"
import Popover from "../popovers/Popover"
import Powermenu from "../powermenu/Powermenu"
import SystemIndicators from "./items/SystemIndicators"
import Taskbar from "./items/Taskbar"
import icons from "../../lib/icons"
import Workspaces from "./items/Workspaces"
import Time from "./items/Time"
// import FocusedClient from "./items/FocusedClient"
// import BatteryLevel from "./items/BatteryLevel"
// import Wifi from "./items/Wifi"
import SysTray from "./items/SysTray"
import Media from "./items/Media"
import AppLauncher from "./items/AppLauncher"
import ControlCenter from "../control-center/ControlCenter"
import { visibleQSMainPage, visiblePowermenu } from "../common/Variables"

const Start = () => {
	return (
		<box>
			<box halign={Gtk.Align.START}>
				<AppLauncher />
                {/* <FocusedClient /> */}
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
				{/* <Weather /> */}
				{/* <Notifications /> */}
			</box>
			<box halign={Gtk.Align.END} hexpand>
				<box className={"recording-box"}>
					{/* <RecordingIndicator /> */}
				</box>
				<box className={"usage-box"}>
					{/* <CpuUsage /> */}
					{/* <RamGbUsage /> */}
					{/* <DiskUsage /> */}
					{/* <BluetoothPowerUsage /> */}
				</box>
				{/* <NoteButton /> */}
				{/* <ScreenshotButton /> */}
				{/* <ColorPickerButton /> */}
                <SysTray />
                {/* <AudioSlider /> */}
                {/* <Wifi /> */}
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
            className={"Popup"}
            onClose={() => visibleQSMainPage.set(false)}
            visible={visibleQSMainPage()}
            marginTop={36}
            marginRight={60}
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
    		className={"powermenu-button"}
            onClickRelease={(_, event: Astal.ClickEvent) => {
                switch (event.button) {
                    case Gdk.BUTTON_PRIMARY:
                        visiblePowermenu.set(true);
                        break;
                    case Gdk.BUTTON_SECONDARY:
                        // bash('openstartupapps')//todo
                        break;
                    case Gdk.BUTTON_MIDDLE:
                        // bash('openstartupapps')
                        break;
                }
            }}
        >
            <box>
    			<icon icon={icons.powermenu.shutdown} iconSize={45} />
            </box>
        </button>
    );

    const sysIndicatorsButton = (
        <SystemIndicators onClicked={() => visibleQSMainPage.set(true)}/>
    );

    return <window
        className={"Bar"}
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
