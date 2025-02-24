import { Gdk, Gtk } from "astal/gtk4";
import { bind, timeout } from "astal";
import Bluetooth from "gi://AstalBluetooth";
import icons from "../../../lib/icons";
import QSPage from "./QSPage";
import { upower } from "../../usage/BluetoothPowerUsage";

type DeviceItemProps = {
	device: Bluetooth.Device;
    bluetooth: Bluetooth.Bluetooth;
};

const DeviceItem = ({ device, bluetooth }: DeviceItemProps) => {
    const power = bind(upower);

	return (
		<button
			cssClasses={["qs-page-item"]}
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
					cssClasses={["bluetooth-device-percentage"]}
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
				<box hexpand={true} />
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

function BluetoothPageContent() {
    const bluetooth = Bluetooth.get_default();
    const isPowered = bind(bluetooth, "isPowered");

	return (
        <box
            vertical={true}
            spacing={8}
            cssClasses={["qspage-scrollable-content"]}
        >
            <box
                onButtonPressed={(_, event: Gdk.ButtonEvent) => {
                    if (event.get_button() !== Gdk.BUTTON_PRIMARY) return;
                    bluetooth.toggle();
                }}
                cssClasses={["qspage-eventbox"]}
            >
                <box
                    cssClasses={isPowered.as((status) => {
                        if (status) {
                            return ["qspage-item-header", "active"];
                        }
                        return ["qspage-item-header"];
                    })}
                >
                    <image
                        iconName={isPowered.as((status) =>
                            status
                                ? icons.bluetooth.enabled
                                : icons.bluetooth.disabled,
                        )}
                    />
                    <label
                        label={isPowered.as((status) =>
                            status ? "On" : "Off",
                        )}
                        hexpand={true}
                        halign={Gtk.Align.START}
                    />
                    <switch
                        hexpand={false}
                        halign={Gtk.Align.END}
                        valign={Gtk.Align.CENTER}
                        active={isPowered}
                        onActivate={({ active }) =>
                            (bluetooth.isPowered = active)
                        }
                    />
                </box>
            </box>
            <box vertical={true} spacing={4}>
                {bind(bluetooth, "devices").as((devices) =>
                    devices.map((device) => <DeviceItem device={device} bluetooth={bluetooth} />),
                )}
            </box>
        </box>
    );
}

export default () => {
    const name = "Bluetooth";

	return (
        <QSPage label={name}>
            <BluetoothPageContent />
        </QSPage>
    );
}
