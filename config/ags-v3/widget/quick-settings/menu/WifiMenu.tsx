import { bind } from "ags/state";
import { config, qsRevealWifi } from "../../../lib/config";
import AstalNetwork from "gi://AstalNetwork";
import { Gtk, For, With } from "ags/gtk4";
import { execAsync } from "ags/process";

export default () => {
    const network = AstalNetwork.get_default();
    const wifi = bind(network, "wifi");

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

    return (
        <revealer
            transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
            revealChild={bind(qsRevealWifi)}
        >
            <box
                marginBottom={config.quickSettings.sliderSpacing}
                visible={wifi.as(Boolean)}
            >
                <With value={bind(network, "wifi")}>
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
                                <For each={bind(wifi, "accessPoints").as(sorted)}>
                                    {(ap) => (
                                    <button $clicked={() => connect(ap)}>
                                        <box spacing={4}>
                                        <image iconName={bind(ap, "iconName")} />
                                        <label label={bind(ap, "ssid")} hexpand={true}/>
                                        <image
                                            iconName="object-select-symbolic"
                                            visible={bind(wifi, "activeAccessPoint").as(
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
                    {/* <For each={bind(audio, "speakers")}>
                        {(speaker) => {
                            return (
                                <button
                                    $clicked={() => speaker.set_is_default(true)}
                                >
                                    <box>
                                        <image
                                            iconName={getProperAudioIcon(speaker.icon)}
                                        />
                                        <label
                                            label={getProperAudioDescription(speaker.description)}
                                            ellipsize={Pango.EllipsizeMode.END}
                                            maxWidthChars={40}
                                            hexpand={true}
                                        />
                                        <image
                                            iconName={icons.ui.tick}
                                            visible={speaker.isDefault}
                                        />
                                    </box>
                                </button>
                            );
                        }}
                    </For> */}
            </box>
        </revealer>
    );
}
