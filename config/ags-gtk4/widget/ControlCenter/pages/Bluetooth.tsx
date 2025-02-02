import AstalBluetooth from "gi://AstalBluetooth?version=0.1";
import Page from "../Page";
import { Gdk, Gtk, hook } from "astal/gtk4";
import { bind, timeout } from "astal";
import icons from "../../../lib/icons";
import { upower } from "../../../lib/variables";
// import { Spinner } from "../../../common/Types";

const bluetooth = AstalBluetooth.get_default();
const power = bind(upower);

type DeviceItemProps = {
	device: AstalBluetooth.Device;
};

const DeviceItem = ({ device }: DeviceItemProps) => {
	return (
		<button
			cssClasses={["control-center__page_item"]}
			on_clicked={() => {
				if (!bluetooth.isPowered) {
					bluetooth.toggle();
				}
				timeout(100, () => {
					device.connect_device(() => {});
				});
			}}
			visible={device.name !== null}
		>
			<box>
				<image iconName={device.icon === null ? icons.bluetooth.enabled : device.icon + "-symbolic"} />
				<label label={device.name} />

				<label
					cssClasses={["bluetooth__percentage"]}
					label={power.as((arr) => {
						const upowerData = arr.find(item => item.model === device.name) || false
						if (upowerData && upowerData?.batteryPercentage) {
							return upowerData.batteryPercentage + "%";
						}
						return "";
					})}
					visible={power.as((arr) => {
						const upowerData = arr.find(item => item.model === device.name) || false
						if (upowerData && upowerData?.batteryPercentage) {
							return true;
						}
						return false;
					})}
				/>
				<box hexpand />
				{/* {
					<Spinner visible={bind(device, "connecting")} />
				} */}
				<image
					iconName={icons.ui.tick}
					visible={bind(device, "connected").as(
						(connected) => connected,
					)}
				/>
			</box>
		</button>
	);
};

export default () => {
	return (
		<Page label={"Bluetooth"}>
			<box
				vertical
				spacing={8}
				cssClasses={["control-center__page_scrollable-content"]}
			>
				<box
					onButtonReleased={(_, event) => {
						if (event.get_button() !== Gdk.BUTTON_PRIMARY) return;
						bluetooth.toggle();
					}}
				>
					<box
						cssClasses={["control-center__page_item-header"]}
						setup={(self) => {
							if (bluetooth.isPowered) {
								self.add_css_class("active")
							} else {
								self.remove_css_class("active")
							}
							hook(self, bluetooth, "notify::is-powered", () => {
								if (bluetooth.isPowered) {
									self.add_css_class("active")
								} else {
									self.remove_css_class("active")
								}
							});
						}}
					>
						<image
							iconName={bind(bluetooth, "isPowered").as((status) =>
								status
									? icons.bluetooth.enabled
									: icons.bluetooth.disabled,
							)}
						/>
						<label
							label={bind(bluetooth, "isPowered").as((status) =>
								status ? "On" : "Off",
							)}
							hexpand
							halign={Gtk.Align.START}
						/>
						<switch
							hexpand={false}
							halign={Gtk.Align.END}
							valign={Gtk.Align.CENTER}
							active={bind(bluetooth, "isPowered")}
							onActivate={({ active }) =>
								(bluetooth.isPowered = active)
							}
						/>
					</box>
				</box>
				<box vertical spacing={4}>
					{bind(bluetooth, "devices").as((devices) =>
						devices.map((device) => <DeviceItem device={device} />),
					)}
				</box>
			</box>
		</Page>
	);
};
