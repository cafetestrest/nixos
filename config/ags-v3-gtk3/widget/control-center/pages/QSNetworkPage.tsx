import { Gdk, Gtk } from "ags/gtk3";
import { execAsync } from "ags/process";
import icons from "../../../lib/icons";
import QSPage from "./QSPage";
import { config } from "../../../lib/config";
import AstalNetwork from "gi://AstalNetwork";
import { createBinding, For } from "ags";

type NetworkPageProps = {
	network: AstalNetwork.Network;
    wifi: AstalNetwork.Wifi;
};

function NetworkPageContent({ network, wifi }: NetworkPageProps) {
    const wifiEnabled = createBinding(wifi, "enabled");
	const nmClient = network.get_client();

    const sorted = (arr: Array<AstalNetwork.AccessPoint>) => {
        return arr.filter((ap) => !!ap.ssid).sort((a, b) => b.strength - a.strength)
    }

    return (
        <box
            vertical={true}
            spacing={8}
            class={"qspage-scrollable-content"}
        >
            <eventbox
                onClickRelease={(_, event) => {
                    if (event.button !== Gdk.BUTTON_PRIMARY) return;
                    if (network.wifi.enabled) {
                        network.wifi.enabled = false;
                    } else {
                        network.wifi.enabled = true;
                        network.wifi.scan();
                    }
                }}
                class={"qspage-eventbox"}
            >
                <box
                    class={wifiEnabled.as((enabled) => {
                        if (enabled) {
                            return "qspage-item-header active";
                        }
                        return "qspage-item-header";
                    })}
                >
                    <icon
                        icon={createBinding(wifi, "iconName")}
                    />
                    <label
                        label={"Wi-Fi"}
                        hexpand={true}
                        halign={Gtk.Align.START}
                    />
                    <switch
                        hexpand={false}
                        halign={Gtk.Align.END}
                        valign={Gtk.Align.CENTER}
                        active={wifiEnabled}
                        onActivate={({ active }) =>
                            (network.wifi.enabled = active)
                        }
                    />
                </box>
            </eventbox>
            <box vertical={true} spacing={4}>
                <For each={createBinding(wifi, "accessPoints")(sorted)}>
                    {(ap: AstalNetwork.AccessPoint) => (
                        <button
                            class={"qs-page-item"}
                            onClicked={() => {
                                execAsync(`nmcli device wifi connect ${ap.bssid}`)
                                // nmClient.activate_connection_async()
                            }}
                        >
                            <box>
                                <icon icon={ap.iconName} iconSize={20} />
                                <label label={ap.ssid || ""} />
                                <icon
                                    visible={createBinding(
                                        wifi,
                                        "activeAccessPoint",
                                    ).as((aap) => aap === ap)}
                                    icon={icons.ui.tick}
                                    hexpand={true}
                                    halign={Gtk.Align.END}
                                />
                            </box>
                        </button>
                    )}
                </For>
            </box>
        </box>
    );
}

export default () => {
    if (config.wifi.hasWifi === false) {
        return (
            <box visible={false} />
        );
    }

    const network = AstalNetwork.get_default();
	const { wifi } = AstalNetwork.get_default();

	if (wifi == null) {
		return null;
	}

    const name = "Network";

	return (
        <QSPage label={name} refresh={() => wifi.scan()} child={<NetworkPageContent network={network} wifi={wifi} />}/>
    );
}
