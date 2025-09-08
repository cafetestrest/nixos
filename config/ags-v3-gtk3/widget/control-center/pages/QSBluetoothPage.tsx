import { Gtk } from "ags/gtk3";
import { timeout } from "ags/time";
import Bluetooth from "gi://AstalBluetooth";
import icons from "../../../lib/icons";
import QSPage from "./QSPage";
// import { upower } from "../../usage/BluetoothPowerUsage";
import { createBinding, createState, For } from "ags";
import { DeviceItemProps } from "../../../lib/types";

const DeviceItem = ({ device }: DeviceItemProps) => {
    const isConnected = createBinding(device, "connected");

	return (
        <box class={"qs-page-item"} visible={device.name !== null}>
            <icon icon={device.icon === null ? icons.bluetooth.enabled : device.icon + "-symbolic"} class={"device-icon"}/>
            <label label={device.name} />

            <box hexpand={true} />
            <icon
                icon={icons.ui.tick}
                visible={isConnected.as(
                    (connected) => connected,
                )}
            />
            <switch
                hexpand={false}
                active={isConnected}
                $={(self) => {
                    self.connect("state-set", (_, state) => {
                        if (state) {
                            return device.connect_device(() => {});
                        }
                        return device.disconnect_device(() => {});
                    });
                }}
            />
        </box>
	);
};

function BluetoothPageContent() {
    const bluetooth = Bluetooth.get_default();
    const isPowered = createBinding(bluetooth, "isPowered");
    const isDiscovering = createBinding(bluetooth.adapter, "discovering");
    const [isRefreshing, setIsRefreshing] = createState(false);

	return (
        <box
            vertical={true}
            spacing={8}
            class={"qspage-scrollable-content"}
        >
            <box
                class={isPowered.as((status) => {
                    if (status) {
                        return "qspage-item-header active";
                    }
                    return "qspage-item-header";
                })}
                spacing={4}
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
                    class={isDiscovering.as(p => {
                        if (p) {
                            return "menu-button filled";
                        }
                        return "menu-button outlined";
                    })}
                    visible={isPowered}
                    onClicked={() => {
                        setIsRefreshing(!isRefreshing.get());

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
                >
					<label
                        label={isDiscovering.as((d) => {
                            if (d) {
                                return "Searching...";
                            }
                            return "Refresh";
                        })}
                    />
				</button>
                <button
                    onClicked={() => bluetooth.toggle()}
                    class={isPowered.as(p => {
                        if (p) {
                            return "menu-button outlined";
                        }
                        return "menu-button filled";
                    })}
                >
					<label label={isPowered.as(p => {
                        if (p) {
                            return "Toggle Off";
                        }
                        return "Toggle On";
                    })}/>
				</button>
            </box>
            <box vertical={true} spacing={4} visible={isPowered}>
                <For each={createBinding(bluetooth, "devices")}>
                    {(device: Bluetooth.Device) => <box><DeviceItem device={device} /></box>}
                </For>
            </box>
        </box>
    );
}

export default () => {
    const name = "Bluetooth";

	return (
        <QSPage label={name} child={<BluetoothPageContent />}/>
    );
}
