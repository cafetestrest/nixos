import icons from "../../../lib/icons";
import QSToggleBlueprint from "./QSToggleBlueprint";
import { qsRevealBluetooth, setQsRevealBluetooth } from "../../../lib/config";
import AstalBluetooth from "gi://AstalBluetooth?version=0.1";
import { createBinding, createState } from "ags";

export default () => {
    const bluetooth = AstalBluetooth.get_default();
    const isPowered = createBinding(bluetooth, "isPowered");
    // const active = createBinding(qsRevealBluetooth);
    const [active, setActive] = createState(qsRevealBluetooth);

    return (
        <QSToggleBlueprint
            className={isPowered.as(p => p ? ["toggles", "control-center-button", "active"] : ["toggles", "control-center-button", "inactive"])}
            clicked={() => {
                setQsRevealBluetooth(!qsRevealBluetooth)
            }}
            icon={isPowered.as(p => icons.bluetooth[p ? "enabled" : "disabled"])}
            label={createBinding(bluetooth, "isConnected").as(c => {
                if (c) {
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
            // arrowIcon={active.as(a => a ? icons.ui.arrow.down : icons.ui.arrow.right)}
            arrowIcon={!active ? icons.ui.arrow.right : icons.ui.arrow.down}
        />
    );
}
