import { bind } from "astal";
import Network from "gi://AstalNetwork";

export default () => {
    const network = Network.get_default()
    const wifi = bind(network, "wifi")

    return (
        <box visible={wifi.as(Boolean)}>
            {wifi.as(wifi => wifi && (
                <icon
                    tooltipText={bind(wifi, "ssid").as(String)}
                    className={"Wifi"}
                    icon={bind(wifi, "iconName")}
                />
            ))}
        </box>
    );
}
