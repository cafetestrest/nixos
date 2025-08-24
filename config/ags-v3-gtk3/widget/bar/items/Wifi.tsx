import Network from "gi://AstalNetwork";
import { createBinding } from "ags";

export default () => {
    const network = Network.get_default()
    const wifi = createBinding(network, "wifi")

    return (
        <box visible={wifi.as(Boolean)}>
            {wifi.as(wifi => wifi && (
                <icon
                    tooltipText={createBinding(wifi, "ssid").as(String)}
                    class={"wifi"}
                    icon={createBinding(wifi, "iconName")}
                />
            ))}
        </box>
    );
}
