import icons from "../../../lib/icons";
import QSToggleBlueprint from "../items/QSToggleBlueprint";
import { bind } from "ags/state";
import { qsRevealWifi } from "../../../lib/config";
import AstalNetwork from "gi://AstalNetwork";
import { With } from "ags/gtk4";

export default () => {
    const active = bind(qsRevealWifi);
    const network = AstalNetwork.get_default();
    const wifi = bind(network, "wifi");
    const wired = bind(network, "wired");

    return (
        <box>
            <box visible={bind(network, "primary").as(p => p === AstalNetwork.Primary.WIFI)}>
                <box visible={wifi.as(Boolean)}>
                    <With value={wifi}>
                        {(wifi) =>
                            wifi && (
                                <QSToggleBlueprint
                                    className={active.as((a) => a ? ["toggles", "control-center-button", "active"] : ["toggles", "control-center-button", "inactive"])}
                                    icon={bind(wifi, "iconName")}
                                    label={"Wifi"}
                                    clicked={() => {
                                        qsRevealWifi.set(!qsRevealWifi.get())
                                    }}
                                    arrowIcon={active.as(a => a ? icons.ui.arrow.down : icons.ui.arrow.right)}
                                />
                            )
                        }
                    </With>
                </box>
            </box>
            <box visible={bind(network, "primary").as(p => p === AstalNetwork.Primary.WIRED)}>
                <box visible={wifi.as(Boolean)}>
                    <With value={wired}>
                        {(wired) =>
                            wired && (
                                <QSToggleBlueprint
                                    className={active.as((a) => a ? ["toggles", "control-center-button", "active"] : ["toggles", "control-center-button", "inactive"])}
                                    icon={bind(wired, "iconName")}
                                    label={"Ethernet"}
                                />
                            )
                        }
                    </With>
                </box>
            </box>
        </box>
    );
}
