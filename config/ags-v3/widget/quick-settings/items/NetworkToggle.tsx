import icons from "../../../lib/icons";
import QSToggleBlueprint from "./QSToggleBlueprint";
import { bind, derive } from "ags/state";
import { qsRevealWifi } from "../../../lib/config";
import AstalNetwork from "gi://AstalNetwork";
import { With } from "ags/gtk4";

export default () => {
    const active = bind(qsRevealWifi);
    const network = AstalNetwork.get_default();
    const wifi = bind(network, "wifi");
    const wired = bind(network, "wired");

    const label = derive(
		[bind(network, "primary"), bind(network.wifi, "ssid")],
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

    return (
        <box>
            <box visible={bind(network, "primary").as(p => p === AstalNetwork.Primary.WIFI)}>
                <With value={wifi}>
                    {(wifi) =>
                        wifi && (
                            <QSToggleBlueprint
                                className={wifi.enabled === true ? ["toggles", "control-center-button", "active"] : ["toggles", "control-center-button", "inactive"]}
                                icon={bind(wifi, "iconName")}
                                label={label()}
                                clicked={() => {
                                    qsRevealWifi.set(!qsRevealWifi.get())
                                }}
                                arrowIcon={active.as(a => a ? icons.ui.arrow.down : icons.ui.arrow.right)}
                                onDestory={() => label.destroy()}
                            />
                        )
                    }
                </With>
            </box>
            <box visible={bind(network, "primary").as(p => p === AstalNetwork.Primary.WIRED)}>
                <With value={wired}>
                    {(wired) =>
                        wired && (
                            <QSToggleBlueprint
                                className={bind(wired, "state").as(s => s === AstalNetwork.DeviceState.ACTIVATED ? ["toggles", "control-center-button", "active"] : ["toggles", "control-center-button", "inactive"])}
                                icon={bind(wired, "iconName")}
                                label={label()}
                                onDestory={() => label.destroy()}
                            />
                        )
                    }
                </With>
            </box>
            <box visible={bind(network, "primary").as(p => p === AstalNetwork.Primary.UNKNOWN)}>
                <QSToggleBlueprint
                    className={"disconnected"}
                    icon={icons.network.wired.disconnected}
                    label={label()}
                    onDestory={() => label.destroy()}
                />
            </box>
        </box>
    );
}
