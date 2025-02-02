import { App, Astal, Gtk, Gdk, hook } from "astal/gtk4";
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
import { namespace as powermenunamespace } from "../Powermenu";

export const namespace = "bar";

const RamGbUsage = () => {
	return (
		<box cssClasses={["ram", "usage"]}>
			<label label={"︁"} cssClasses={["ram", "icon"]}/>
			<label label={bind(ramGB)}/>
		</box>
	);
};

const CpuUsage = () => {
	return (
		<box cssClasses={["cpu", "usage"]}>
			<label label={"︁"} cssClasses={["cpu", "icon"]}/>
			<label label={bind(cpu)}/>
		</box>
	);
};

const DiskUsage = () => {
	return (
		<box cssClasses={["disk", "usage"]}>
			<label label={""} cssClasses={["disk", "icon"]}/>
			<label label={bind(disk)}/>
		</box>
	);
};

const BluetoothPowerUsage = () => {
	return <box cssClasses={["btwrapper"]}>
		{bind(upower).as(arr => arr.map(power => {
			if (!power.model || !power.batteryPercentage || !power.iconName) {
				return "";
			}

			return (<box cssClasses={["bt-usage"]}>
				<image iconName={power.iconName} cssClasses={["bt-icon"]}/>
				<label label={power.batteryPercentage + "%"}/>
			</box>)
			}
		))}
	</box>;
};

const NoteButton = () => {
	return (<BarButton
		className="extra-buttons"
		onClicked={() => {
			bash('codium ~/Documents/note.md')
		}}
	>
		<box
			cssClasses={["note-box"]}
			valign={Gtk.Align.CENTER}
			halign={Gtk.Align.CENTER}
			hexpand={true}
			vexpand={true}
		>
			<image iconName={icons.note}/>
		</box>
	</BarButton>)
};

const ScreenshotButton = () => {
	return (<BarButton
		className="extra-buttons"
		onButtonReleased={(_, event: Gdk.ButtonEvent) => {
			switch (event.get_button()) {
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
			cssClasses={["screenshot-box"]}
			valign={Gtk.Align.CENTER}
			halign={Gtk.Align.CENTER}
			hexpand={true}
			vexpand={true}
		>
			<image iconName={icons.screenshot}/>
		</box>
	</BarButton>)
};

const ColorPickerButton = () => {
	return (<BarButton
		className="extra-buttons"
		onClicked={() => {
			bash('hyprpicker -a')
		}}
	>
		<box
			cssClasses={["color-picker-box"]}
			valign={Gtk.Align.CENTER}
			halign={Gtk.Align.CENTER}
			hexpand={true}
			vexpand={true}
		>
			<image iconName={icons.ui.colorpicker}/>
		</box>
	</BarButton>)
};

const PowerMenuButton = () => (
	<BarButton
		className="powermenu-button"
		onClicked={() => {}}
		onButtonPressed={(_, event: Gdk.ButtonEvent) => {
			switch (event.get_button()) {
				case Gdk.BUTTON_PRIMARY:
					toggleWindow(powermenunamespace)
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
			const window = App.get_window(powermenunamespace);
			if (window) {
				hook(self, window, "notify::visible", () => {
					if (window.visible) {
						self.add_css_class("active")
					} else {
						self.remove_css_class("active")
					}
				})
			}
		}}
	>
		<box
			valign={Gtk.Align.CENTER}
			halign={Gtk.Align.CENTER}
			hexpand={true}
			vexpand={true}
		>
			<image iconName={icons.powermenu.shutdown} />
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
				<box cssClasses={["recording-box"]}>
					<RecordingIndicator />
				</box>
				<box cssClasses={["usage-box"]}>
					<CpuUsage />
					<RamGbUsage />
					<DiskUsage />
					<BluetoothPowerUsage />
				</box>
				<NoteButton />
				<ScreenshotButton />
				<ColorPickerButton />
				{/* <KeyboardLayout /> */}
				{/* <box cssClasses={["bar__rounded-box"]} spacing={spacing / 2}> */}
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
			visible={true}
			vexpand={true}
			cssClasses={["Bar"]}
			namespace={namespace}
			gdkmonitor={gdkmonitor}
			exclusivity={Astal.Exclusivity.EXCLUSIVE}
			anchor={
				Astal.WindowAnchor.TOP |
				Astal.WindowAnchor.LEFT |
				Astal.WindowAnchor.RIGHT
			}
			application={App}
		>
			<centerbox cssClasses={[namespace]} valign={Gtk.Align.CENTER}>
				<Start />
				<Center />
				<End />
			</centerbox>
		</window>
	);
}
