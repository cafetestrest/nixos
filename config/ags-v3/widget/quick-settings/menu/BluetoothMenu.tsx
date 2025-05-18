import { bind, State } from "ags/state";
import { config, qsRevealBluetooth } from "../../../lib/config";
import { Gtk, For, With } from "ags/gtk4";
import AstalBluetooth from "gi://AstalBluetooth?version=0.1";
import { upower } from "../../bar/items/BluetoothPowerUsage";
import icons from "../../../lib/icons";
import { timeout } from "ags/time";

type DeviceItemProps = {
	device: AstalBluetooth.Device;
};

const DeviceItem = ({ device }: DeviceItemProps) => {
    const power = bind(upower);
    const isConnected = bind(device, "connected");

    return (
        <box visible={device.name !== null}>
            <image
                iconName={device.icon === null ? icons.bluetooth.enabled : device.icon + "-symbolic"}
                cssClasses={["device-icon"]}
            />
            <label
                label={device.name}
            />
            <label
                cssClasses={["bluetooth-device-percentage"]}
                label={power.as((arr) => {
                    const upowerData = arr.find(item => item.model === device.name) || false
                    if (upowerData && upowerData?.batteryPercentage) {
                        return upowerData.batteryPercentage + "%";
                    }
                    return "";
                })}
                $destroy={() => upower.destroy()}
                visible={power.as(arr => {
                    const upowerData = arr.find(item => item.model === device.name) || false
                    if (upowerData && upowerData?.batteryPercentage) {
                        return true;
                    }
                    return false;
                })}
            />
            <box hexpand={true} />
            <image
                iconName={icons.ui.tick}
                visible={isConnected}
            />
            <switch
                active={isConnected}
                $={self => {
                    self.connect("state-set", (_, state) => {
                        if (state) {
                            return device.connect_device(() => {});
                        }
                        return device.disconnect_device(() => {});
                    })
                }}
            />
        </box>
    );
}

export default () => {
    const bluetooth = AstalBluetooth.get_default();
    const isPowered = bind(bluetooth, "isPowered");
    const isDiscovering = bind(bluetooth.adapter, "discovering");
    const isRefreshing = new State<boolean>(false);

    return (
        <revealer
            transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
            revealChild={bind(qsRevealBluetooth)}
        >
            <box
                marginTop={config.quickSettings.sliderSpacing}
                visible={isPowered.as(Boolean)}
            >
                <box
                    cssClasses={["qs-menu"]}
                    spacing={config.quickSettings.menuSpacing}
                    orientation={Gtk.Orientation.VERTICAL}
                    hexpand={true}
                >
                    <label
                        label={"Bluetooth"}
                        cssClasses={["qs-menu-label"]}
                    />
                    <box
                        cssClasses={isPowered.as(p => p ? ["menu-header", "active"] : ["menu-header", "inactive"])}
                        spacing={config.quickSettings.menuSpacing}
                    >
                        <image
                            iconName={isPowered.as(p => p ? icons.bluetooth.enabled : icons.bluetooth.disabled)}
                        />
                        <label
                            label={isPowered.as(p => p ? "On" : "Off")}
                            hexpand={true}
                            halign={Gtk.Align.START}
                        />
                        <button
                            cssClasses={isDiscovering.as(d => d ? ["menu-button", "filled"] : ["menu-button", "outlined"])}
                            $clicked={() => {
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
                        >
                            <label
                                label={isDiscovering.as(d => d ? "Searching..." : "Refresh")}
                            />
                        </button>
                        <button
                            cssClasses={isPowered.as(p => p ? ["menu-button", "outlined"] : ["menu-button", "filled"])}
                            $clicked={() => bluetooth.toggle()}
                        >
                            <label
                                label={isPowered.as(p => p ? "Toggle Off" : "Toggle On")}
                            />
                        </button>
                    </box>
                    <box
                        cssClasses={["qs-menu-content"]}
                        spacing={config.quickSettings.menuSpacing}
                        orientation={Gtk.Orientation.VERTICAL}
                    >
                        <For each={bind(bluetooth, "devices")}>
                            {(device) => (
                                <DeviceItem device={device} />
                            )}
                        </For>
                    </box>
                </box>
            </box>
        </revealer>
    );
}
