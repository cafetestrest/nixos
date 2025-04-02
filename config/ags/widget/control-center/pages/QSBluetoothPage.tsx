import { Gdk, Gtk } from "astal/gtk3";
import { bind, timeout, Variable } from "astal";
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
    const isConnected = bind(device, "connected");

	return (
        <box className={"qs-page-item"} visible={device.name !== null}>
            <icon icon={device.icon === null ? icons.bluetooth.enabled : device.icon + "-symbolic"} className={"device-icon"}/>
            <label label={device.name} />

            <label
                className={"bluetooth-device-percentage"}
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
            <icon
                icon={icons.ui.tick}
                visible={isConnected.as(
                    (connected) => connected,
                )}
            />
            <switch
                hexpand={false}
                active={isConnected}
                setup={(self) => {
                    self.connect("state-set", (_, state) => {
                        console.log("state", state);

                        if (state) {
                            return device.connect_device(() => {});
                        }
                        return device.disconnect_device(device.get_address);
                    });
                }}
            />
        </box>
	);
};

function BluetoothPageContent() {
    const bluetooth = Bluetooth.get_default();
    const isPowered = bind(bluetooth, "isPowered");
    const isDiscovering = bind(bluetooth.adapter, "discovering");
    const isRefreshing = Variable(false);

	return (
        <box
            vertical={true}
            spacing={8}
            className={"qspage-scrollable-content"}
        >
            <box
                className={isPowered.as((status) => {
                    if (status) {
                        return "qspage-item-header active";
                    }
                    return "qspage-item-header";
                })}
            >
                <icon
                    icon={isPowered.as((status) =>
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
                <button
                    hexpand={false}
                    halign={Gtk.Align.END}
                    visible={isPowered}
                    label={isDiscovering.as((d) => {
                        if (d) {
                            return "Searching";
                        }
                        return "Refresh";
                    })}
                    onClicked={() => {
                        const refreshingState = isRefreshing.get();
                        isRefreshing.set(!refreshingState);

                        if (!bluetooth.adapter.discovering) {
                            try {
                                bluetooth.adapter.start_discovery();

                                timeout(15000, () => {
                                    if (bluetooth.adapter.discovering) {
                                        bluetooth.adapter.stop_discovery();
                                    }
                                });
                            } catch (error) {
                                console.error("Failed to start bluetooth discovery. Error: ", error);
                            }
                        } else if (bluetooth.adapter.discovering) {
                            bluetooth.adapter.stop_discovery();
                        }
                    }}
                />
                <switch
                    hexpand={false}
                    halign={Gtk.Align.END}
                    valign={Gtk.Align.CENTER}
                    active={isPowered}
                    onActivate={({ active }) =>
                        (bluetooth.isPowered = active)
                    }
                    setup={(self) => {
                        self.connect("state-set", (_, state) => {
                            bluetooth.toggle()
                        });
                    }}
                />
            </box>
            <box vertical={true} spacing={4} visible={isPowered}>
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
