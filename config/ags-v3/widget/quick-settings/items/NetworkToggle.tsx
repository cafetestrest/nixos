import icons from "../../../lib/icons";
import QSToggleBlueprint from "./QSToggleBlueprint";
import { createBinding, createComputed, createState, With } from "ags";
import { qsRevealWifi, setQsRevealWifi } from "../../../lib/config";
import AstalNetwork from "gi://AstalNetwork";

export default () => {
    const network = AstalNetwork.get_default();
    const wifi = createBinding(network, "wifi");
    const wired = createBinding(network, "wired");

    const label = createComputed(
		[createBinding(network, "primary"), createBinding(network.wifi, "ssid")],
		(primary, ssid) => {
			if (primary === AstalNetwork.Primary.WIFI) {
				return ssid || "Wi-Fi";
			} else if (primary === AstalNetwork.Primary.WIRED) {
				return "Ethernet";
            } else {
				return "Disconnected";
			}
		},
	);

    return null; //todo fix
    return (
        <box>
            <box visible={createBinding(network, "primary").as(p => p === AstalNetwork.Primary.WIFI)}>
                <With value={wifi}>
                    {(wifi) =>
                        wifi && (
                            <QSToggleBlueprint
                                className={wifi.enabled === true ? ["toggles", "control-center-button", "active"] : ["toggles", "control-center-button", "inactive"]}
                                icon={createBinding(wifi, "iconName")}
                                label={label}
                                clicked={() => {
                                    setQsRevealWifi(!qsRevealWifi)
                                }}
                                arrowIcon={qsRevealWifi(a => a ? icons.ui.arrow.down : icons.ui.arrow.right)}
                            />
                        )
                    }
                </With>
            </box>
            <box visible={createBinding(network, "primary").as(p => p === AstalNetwork.Primary.WIRED)}>
                <With value={wired}>
                    {(wired) =>
                        wired && (
                            <QSToggleBlueprint
                                className={createBinding(wired, "state").as(s => s === AstalNetwork.DeviceState.ACTIVATED ? ["toggles", "control-center-button", "active"] : ["toggles", "control-center-button", "inactive"])}
                                icon={createBinding(wired, "iconName")}
                                label={label}
                            />
                        )
                    }
                </With>
            </box>
            <box visible={createBinding(network, "primary").as(p => p === AstalNetwork.Primary.UNKNOWN)}>
                <QSToggleBlueprint
                    className={"disconnected"}
                    icon={icons.network.wired.disconnected}
                    label={label}
                />
            </box>
        </box>
    );
}
