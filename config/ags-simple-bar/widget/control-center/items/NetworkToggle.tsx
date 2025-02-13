import { bind, Variable } from "astal"
import icons from "../../../lib/icons";
import { qsPage } from "../../common/Variables";
import QSToggle from "./QSToggle";
import Network from "gi://AstalNetwork";

export default () => {
	const network = Network.get_default();
	const { wifi, wired } = Network.get_default();

	const wiredIcon = bind(wired, "iconName");
	const wiredState = bind(wired, "state");

    if (wifi === null) {
        return (
            <QSToggle
                name={"network"}
                icon={wiredIcon}
                label={"Ethernet"}
                hasArrow={false}
                className={bind(wiredState.as((state) => {
                    if (state === Network.DeviceState.ACTIVATED) {
                        return "toggles control-center-button active";
                    }
                    return "toggles control-center-button";
                }))}
            />
        );        
    }

    const primary = bind(network, "primary");
	const wifiIcon = bind(wifi, "iconName");

    // This is a hack to make sure the icon is updated when the primary network changes
	const icon = Variable.derive([primary, wifiIcon], (primary, iconWifi) => {
		if (primary == Network.Primary.WIFI) {
			return iconWifi;
		} else {
			return icons.network.wired.connected;
		}
	});

    const label = Variable.derive(
		[bind(network, "primary"), bind(wifi, "ssid")],
		(primary, ssid) => {
			if (primary == Network.Primary.WIFI) {
				return ssid || "Wi-Fi";
			} else {
				return "Ethernet";
			}
		},
	);

    return (
        <QSToggle
            className={bind(wifi, "enabled").as(() => {
                if (wifi.enabled) {
                    return "toggles control-center-button active";
                }
                return "toggles control-center-button";
            })}
            onPrimaryClick={() => qsPage.set("network")}
            icon={bind(icon)}
            label={bind(label)}
            hasArrow={true}
        />
    )
}
