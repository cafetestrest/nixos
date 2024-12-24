import AstalBluetooth from "gi://AstalBluetooth?version=0.1";
import Page from "../Page";
import { Gtk } from "astal/gtk3";
import { bind, timeout } from "astal";
import icons from "../../../lib/icons";

const bluetooth = AstalBluetooth.get_default();

type DeviceItemProps = {
	device: AstalBluetooth.Device;
};

const DeviceItem = ({ device }: DeviceItemProps) => {
	return (
		<button
			className="control-center__page_item"
			on_clicked={() => {
				if (!bluetooth.isPowered) {
					bluetooth.toggle();
				}
				timeout(100, () => {
					device.connect_device(() => {});
				});
			}}
		>
			<box>
				<icon icon={device.icon + "-symbolic"} />
				<label label={device.name} />
				{
					// Todo: Add bluetooth battery percentage
					// <label
					// 	className="bluetooth__percentage"
					// 	label={`${device.battery_percentage}%`}
					// 	visible={bind(device, "battery_percentage").as(
					// 		(p) => p > 0,
					// 	)}
					// />
				}
				<box hexpand />
				{
					// TODO: Add spinner
					// <spinner visible={bind(device, "connecting")} />
				}
				<icon
					icon={icons.ui.tick}
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
				className={"control-center__page_scrollable-content"}
			>
				<eventbox
					onClickRelease={(_, event) => {
						if (event.button !== 1) return;
						bluetooth.toggle();
					}}
				>
					<box
						className="control-center__page_item-header"
						setup={(self) => {
							self.toggleClassName("active", bluetooth.isPowered);
							self.hook(bluetooth, "notify::is-powered", () => {
								self.toggleClassName(
									"active",
									bluetooth.isPowered,
								);
							});
						}}
					>
						<icon
							icon={bind(bluetooth, "isPowered").as((status) =>
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
				</eventbox>
				<box vertical spacing={4}>
					{bind(bluetooth, "devices").as((devices) =>
						devices.map((device) => <DeviceItem device={device} />),
					)}
				</box>
			</box>
		</Page>
	);
};
