import { bind } from "astal";
import Network from "gi://AstalNetwork";

export default () => {
    const network = Network.get_default()
    const wifi = bind(network, "wifi")

    return (
        <box visible={wifi.as(Boolean)}>
            {wifi.as(wifi => wifi && (
                <image
                    tooltipText={bind(wifi, "ssid").as(String)}
                    cssClasses={["Wifi"]}
                    iconName={bind(wifi, "iconName")}
                />
            ))}
        </box>
    );
}
