import { App, Astal, Gtk, Gdk } from "astal/gtk3";
import { bind } from "astal";
import Workspaces from "./items/Workspaces";
import { ramGB, cpu, disk, upower } from "../../lib/variables";
// import ActiveApp from "./items/ActiveApp";
import Clock from "./items/Clock";
// import Battery from "./items/Battery";
import Tray from "./items/Tray";
import SystemIndicators from "./items/SystemIndicators";
import Notifications from "./items/Notifications";
import AppLauncher from "./items/AppLauncher";
// import KeyboardLayout from "./items/KeyboardLayout";
import Weather from "./items/Weather";
import RecordingIndicator from "./items/RecordingIndicator";
import BarButton from "./BarButton";
import icons from "../../lib/icons";
import { bash, toggleWindow } from "../../lib/utils";
import Taskbar from "./items/Taskbar";
import MediaIndicator from "./items/MediaIndicator";

const RamGbUsage = () => {
	return (
		<box className={"ram usage"}>
			<label label={"︁"} className={"ram icon"}/>
			<label label={bind(ramGB)}/>
		</box>
	);
};

const CpuUsage = () => {
	return (
		<box className={"cpu usage"}>
			<label label={"︁"} className={"cpu icon"}/>
			<label label={bind(cpu)}/>
		</box>
	);
};

const DiskUsage = () => {
	return (
		<box className={"disk usage"}>
			<label label={""} className={"disk icon"}/>
			<label label={bind(disk)}/>
		</box>
	);
};

const BluetoothPowerUsage = () => {
	return <box className={"btwrapper"}>
		{bind(upower).as(arr => arr.map(power => {
			if (!power.model || !power.batteryPercentage || !power.iconName) {
				return "";
			}

			return (<box className={"bt-usage"}>
				<icon icon={power.iconName} className={"bt-icon"}/>
				<label label={power.batteryPercentage + "%"}/>
			</box>)
			}
		))}
	</box>;
};

const NoteButton = () => {
	return (<BarButton
		className="note-button extra-buttons"
		onClicked={() => {
			bash('codium ~/Documents/note.md')
		}}
	>
		<box
			className="note-box"
			valign={Gtk.Align.CENTER}
			halign={Gtk.Align.CENTER}
			hexpand={true}
			vexpand={true}
		>
			<icon icon={icons.note}/>
		</box>
	</BarButton>)
};

const ScreenshotButton = () => {
	return (<BarButton
		className="screenshot-button extra-buttons"
		onClickRelease={(_, event: Astal.ClickEvent) => {
			switch (event.button) {
				case Gdk.BUTTON_PRIMARY:
					bash('screenshot 1')
					break;
				case Gdk.BUTTON_SECONDARY:
					bash('screenshot')
					break;
				case Gdk.BUTTON_MIDDLE:
					bash('screenshot 2')
					break;
			}
		}}
	>
		<box
			className="screenshot-box"
			valign={Gtk.Align.CENTER}
			halign={Gtk.Align.CENTER}
			hexpand={true}
			vexpand={true}
		>
			<icon icon={icons.screenshot}/>
		</box>
	</BarButton>)
};

const ColorPickerButton = () => {
	return (<BarButton
		className="color-picker-button extra-buttons"
		onClicked={() => {
			bash('hyprpicker -a')
		}}
	>
		<box
			className="color-picker-box"
			valign={Gtk.Align.CENTER}
			halign={Gtk.Align.CENTER}
			hexpand={true}
			vexpand={true}
		>
			<icon icon={icons.ui.colorpicker}/>
		</box>
	</BarButton>)
};

const PowerMenuButton = () => (
	<BarButton
		className={"powermenu-button"}
		onClicked={() => {}}
		onClickRelease={(_, event: Astal.ClickEvent) => {
			switch (event.button) {
				case Gdk.BUTTON_PRIMARY:
					toggleWindow("powermenu")
					break;
				case Gdk.BUTTON_SECONDARY:
					bash('openstartupapps')
					break;
				case Gdk.BUTTON_MIDDLE:
					bash('openstartupapps')
					break;
			}
		}}
		setup={(self) => {
			const window = App.get_window("powermenu");
			if (window) {
				self.hook(window, "notify::visible", () => {
					self.toggleClassName("active", window.visible);
				});
			}
		}}
	>
		<box
			valign={Gtk.Align.CENTER}
			halign={Gtk.Align.CENTER}
			hexpand={true}
			vexpand={true}
		>
			<icon icon={icons.powermenu.shutdown} iconSize={45} />
		</box>
	</BarButton>
);

const Start = () => {
	return (
		<box>
			<box halign={Gtk.Align.START}>
				<AppLauncher />
				{/* <ActiveApp /> */}
				<Taskbar />
				<Workspaces />
			</box>
			<box halign={Gtk.Align.END}>
				<MediaIndicator />
			</box>
		</box>
	);
};

const Center = () => {
	return (
		<box>
			<Clock />
		</box>
	);
};

const End = () => {
	return (
		<box>
			<box halign={Gtk.Align.START}>
				<Weather />
				<Notifications />
			</box>
			<box halign={Gtk.Align.END}>
				<box className={"recording-box"}>
					<RecordingIndicator />
				</box>
				<box className={"usage-box"}>
					<CpuUsage />
					<RamGbUsage />
					<DiskUsage />
					<BluetoothPowerUsage />
				</box>
				<NoteButton />
				<ScreenshotButton />
				<ColorPickerButton />
				{/* <KeyboardLayout /> */}
				{/* <box className="bar__rounded-box" spacing={spacing / 2}> */}
					<Tray />
					<SystemIndicators />
				{/* </box> */}
				{/* <Battery /> */}
				<PowerMenuButton />
			</box>
		</box>
	);
};

export default function Bar(gdkmonitor: Gdk.Monitor) {
	return (
		<window
			vexpand={true}
			className="Bar"
			namespace="bar"
			gdkmonitor={gdkmonitor}
			exclusivity={Astal.Exclusivity.EXCLUSIVE}
			anchor={
				Astal.WindowAnchor.TOP |
				Astal.WindowAnchor.LEFT |
				Astal.WindowAnchor.RIGHT
			}
			application={App}
		>
			<centerbox className="bar" valign={Gtk.Align.CENTER}>
				<Start />
				<Center />
				<End />
			</centerbox>
		</window>
	);
}
