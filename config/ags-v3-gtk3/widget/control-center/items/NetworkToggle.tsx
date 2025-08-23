import icons from "../../../lib/icons";
import { qsPage, setQsPage } from "../../common/Variables";
import QSToggle from "./QSToggle";
import Network from "gi://AstalNetwork";
import { hasWifi } from "../../common/Variables";
import { createBinding, createComputed } from "ags";

export default () => {
	const network = Network.get_default();
	const { wifi, wired } = Network.get_default();

	const wiredIcon = createBinding(wired, "iconName");
	const wiredState = createBinding(wired, "state");

    if (hasWifi === false || wifi === null) {
        return (
            <QSToggle
                name={"network"}
                icon={wiredIcon}
                label={"Ethernet"}
                hasArrow={false}
                className={wiredState.as((state) => {
                    if (state === Network.DeviceState.ACTIVATED) {
                        return "toggles control-center-button active";
                    }
                    return "toggles control-center-button";
                })}
            />
        );
    }

    const primary = createBinding(network, "primary");
	const wifiIcon = createBinding(wifi, "iconName");

    // This is a hack to make sure the icon is updated when the primary network changes
	const icon = createComputed([primary, wifiIcon], (primary, iconWifi) => {
		if (primary == Network.Primary.WIFI) {
			return iconWifi;
		} else {
			return icons.network.wired.connected;
		}
	});

    const label = createComputed(
		[createBinding(network, "primary"), createBinding(wifi, "ssid")],
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
            className={createBinding(wifi, "enabled").as(() => {
                if (wifi.enabled) {
                    return "toggles control-center-button active";
                }
                return "toggles control-center-button";
            })}
            onPrimaryClick={() => setQsPage("network")}
            icon={icon}
            label={label}
            hasArrow={true}
        />
    )
}
