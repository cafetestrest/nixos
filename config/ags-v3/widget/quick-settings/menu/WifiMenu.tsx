import { createBinding, For, With } from "ags";
import { config, qsRevealWifi } from "../../../lib/config";
import AstalNetwork from "gi://AstalNetwork";
import { Gtk } from "ags/gtk4";
import { execAsync } from "ags/process";

export default () => {
    const network = AstalNetwork.get_default();
    const wifi = createBinding(network, "wifi");

    const sorted = (arr: Array<AstalNetwork.AccessPoint>) => {
        return arr.filter((ap) => !!ap.ssid).sort((a, b) => b.strength - a.strength)
    };

    async function connect(ap: AstalNetwork.AccessPoint) {
        // connecting to ap is not yet supported
        // https://github.com/Aylur/astal/pull/13
        try {
          await execAsync(`nmcli d wifi connect ${ap.bssid}`);
        } catch (error) {
          // you can implement a popup asking for password here
          console.error(error);
        }
    };
    return null; //todo fix

    return (
        <revealer
            transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
            revealChild={qsRevealWifi}
        >
            <box
                marginTop={config.quickSettings.sliderSpacing}
                visible={wifi.as(Boolean)}
            >
                <With value={wifi}>
                    {(wifi) =>
                    wifi && (
                        <box
                            cssClasses={["qs-menu"]}
                            spacing={config.quickSettings.menuSpacing}
                            orientation={Gtk.Orientation.VERTICAL}
                            hexpand={true}
                        >
                            <label
                                label={"Wifi"}
                                cssClasses={["qs-menu-label"]}
                            />
                            <box
                                cssClasses={["qs-menu-content"]}
                                spacing={config.quickSettings.menuSpacing}
                                orientation={Gtk.Orientation.VERTICAL}
                            >
                                <For each={createBinding(wifi, "accessPoints")(sorted)}>
                                    {(ap: AstalNetwork.AccessPoint) => (
                                        <button onClicked={() => connect(ap)}>
                                            <box spacing={4}>
                                            <image iconName={createBinding(ap, "iconName")} />
                                            <label label={createBinding(ap, "ssid")} hexpand={true}/>
                                            <image
                                                iconName="object-select-symbolic"
                                                visible={createBinding(wifi, "activeAccessPoint").as(
                                                (active) => active === ap,
                                                )}
                                            />
                                            </box>
                                        </button>
                                    )}
                                </For>
                            </box>
                        </box>
                    )
                }
                </With>
            </box>
        </revealer>
    );
}
