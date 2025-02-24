import { Gdk, Gtk } from "astal/gtk4";
import { bind, timeout } from "astal";
import icons from "../../../lib/icons";
import QSPage from "./QSPage";
import { hasWifi } from "../../common/Variables";
import AstalNetwork from "gi://AstalNetwork";

type NetworkPageProps = {
	network: AstalNetwork.Network;
    wifi: AstalNetwork.Wifi;
};

function NetworkPageContent({ network, wifi }: NetworkPageProps) {
    const wifiEnabled = bind(wifi, "enabled");
	const nmClient = network.get_client();

	return (
        <box
            vertical={true}
            spacing={8}
            cssClasses={["qspage-scrollable-content"]}
        >
            <box
                onButtonPressed={(_, event: Gdk.ButtonEvent) => {
                    if (event.get_button() !== Gdk.BUTTON_PRIMARY) return;
                    if (network.wifi.enabled) {
                        network.wifi.enabled = false;
                    } else {
                        network.wifi.enabled = true;
                        network.wifi.scan();
                    }
                }}
                cssClasses={["qspage-eventbox"]}
            >
                <box
                    cssClasses={wifiEnabled.as((enabled) => {
                        if (enabled) {
                            return ["qspage-item-header", "active"];
                        }
                        return ["qspage-item-header"];
                    })}
                >
                    <image
                        iconName={bind(wifi, "iconName")}
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
            </box>
            <box vertical={true} spacing={4}>
                {bind(wifi, "accessPoints").as((points) =>
                    points.map((ap) => (
                        <button
                            cssClasses={["qs-page-item"]}
                            onClicked={() => {
                                nmClient.activate_connection_async()
                            }}
                        >
                            <box>
                                <image iconName={ap.iconName} iconSize={20} />
                                <label label={ap.ssid || ""} />
                                <image
                                    visible={bind(
                                        wifi,
                                        "activeAccessPoint",
                                    ).as((aap) => aap === ap)}
                                    iconName={icons.ui.tick}
                                    hexpand={true}
                                    halign={Gtk.Align.END}
                                />
                            </box>
                        </button>
                    )),
                )}
            </box>
        </box>
    );
}

export default () => {
    if (hasWifi === false) {
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
        <QSPage label={name} refresh={() => wifi.scan()}>
            <NetworkPageContent network={network} wifi={wifi} />
        </QSPage>
    );
}
