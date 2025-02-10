import { bind } from "astal"
import icons from "../../../lib/icons";
import { Gtk } from "astal/gtk3";
import Bluetooth from "gi://AstalBluetooth"
import { qsPage } from "../../common/Variables";

export default () => {
	const bluetooth = Bluetooth.get_default();
    const isPowered = bind(bluetooth, "isPowered");
    const hasArrow = true;

    return (
        <button
            className={bind(isPowered.as((p) => {
                if (p) {
                    return "toggles control-center-button active";
                }
                return "toggles control-center-button";
            }))}
            onClicked={() => qsPage.set("bluetooth")}
        >
            <box
                halign={Gtk.Align.FILL}
            >
                <icon
                    icon={isPowered.as((p) => icons.bluetooth[p ? "enabled" : "disabled"])}
                />
                <label
                    halign={Gtk.Align.START}
                    label={bind(bluetooth, "isConnected").as((isConnected) => {
                        if (isConnected) {
                            const devices = bluetooth.get_devices();
                            const connectedDevices = devices.filter(
                                (device) => device.connected,
                            );
                            if (connectedDevices.length >= 2) {
                                return connectedDevices.length + " devices";
                            } else if (connectedDevices.length === 1) {
                                return connectedDevices[0].name;
                            } else {
                                return "Bluetooth";
                            }
                        }
                        return "Bluetooth";
                    })}
                    hexpand
                />
                {hasArrow && (
                    <icon
                        halign={Gtk.Align.END}
                        icon={icons.ui.arrow.right}
                    />
                )}
            </box>
        </button>
    );
}
