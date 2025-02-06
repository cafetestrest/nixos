import { App } from "astal/gtk3"
import { Variable, bind } from "astal"
import { Astal, Gtk, Gdk } from "astal/gtk3"
import PopoverCenter from "../popovers/PopoverCenter"
import Popover from "../popovers/Popover"
import MprisPlayers from "../media-player/MediaPlayer"
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
import AudioSlider from "../control-center/items/AudioSlider"

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
    const visiblePopupCenter = Variable(false);
    const visiblePopup = Variable(false);

    const _popover = (
        <Popover
            className={"Popup"}
            onClose={() => visiblePopup.set(false)}
            visible={visiblePopup()}
            marginTop={36}
            marginRight={60}
            valign={Gtk.Align.START}
            halign={Gtk.Align.END}
        >
            <box className={"popup"} vertical>
                {/* maxWidthChars is needed to make wrap work */}
                {/* <label label={"lorem2"} wrap maxWidthChars={8} />
                <button onClicked={() => visiblePopup.set(false)}>
                    Click me to close the popup
                </button> */}
                <AudioSlider/>
                <MprisPlayers/>
            </box>
        </Popover>
    );

    const _powermenuPopover = (
        <PopoverCenter
            className={"Popup"}
            onClose={() => visiblePopupCenter.set(false)}
            visible={visiblePopupCenter()}
        >
            <box className={"popup"} vertical>
                {/* maxWidthChars is needed, wrap will work as intended */}
                <Powermenu onClicked={() => visiblePopupCenter.set(false)} />
            </box>
        </PopoverCenter>
    );

    const powermenuButton = (
        <button
    		className={"powermenu-button"}
            onClickRelease={(_, event: Astal.ClickEvent) => {
                switch (event.button) {
                    case Gdk.BUTTON_PRIMARY:
                        visiblePopupCenter.set(true);
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
        <SystemIndicators onClicked={() => visiblePopup.set(true)}/>
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
