import { bind, Variable } from "astal";
import icons from "../../../lib/icons";
import ControlCenterButton from "../ControlCenterButton";
import Network from "gi://AstalNetwork?version=0.1";

export default () => {
	const network = Network.get_default();
	const { wifi, wired } = Network.get_default();

	var icon;

	if (wifi == null) {
		return (
			<ControlCenterButton
				name="network"
				icon={bind(wired, "iconName")}
				label={"Ethernet"}
				connection={[Variable(true), () => true]}
			/>
		);
	}

	const primary = bind(network, "primary");
	const wifiIcon = bind(wifi, "iconName");
	const wiredIcon = bind(wired, "iconName");

	// This is a hack to make sure the icon is updated when the primary network changes
	icon = Variable.derive([primary, wifiIcon], (primary, iconWifi) => {
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

	const connection = [bind(wifi, "enabled"), () => wifi.enabled];

	return (
		<ControlCenterButton
			name="network"
			icon={bind(icon)}
			label={bind(label)}
			connection={connection}
			onPrimaryClick={() => {
				if (wifi.enabled) {
					wifi.enabled = false;
				} else {
					wifi.enabled = true;
					wifi.scan();
				}
			}}
			menuName="network"
		/>
	);
};
