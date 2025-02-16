import { bind } from "astal"
import icons from "../../../lib/icons";
import Bluetooth from "gi://AstalBluetooth"
import { qsPage } from "../../common/Variables";
import QSToggle from "./QSToggle";

export default () => {
	const bluetooth = Bluetooth.get_default();
    const isPowered = bind(bluetooth, "isPowered");

    return (
        <QSToggle
            className={bind(isPowered.as((p) => {
                if (p) {
                    return "toggles control-center-button active";
                }
                return "toggles control-center-button";
            }))}
            onPrimaryClick={() => qsPage.set("bluetooth")}
            icon={isPowered.as((p) => icons.bluetooth[p ? "enabled" : "disabled"])}
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
            hasArrow={true}
        />
    )
}
