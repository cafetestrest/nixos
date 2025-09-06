import { Gtk } from "ags/gtk3";
import {
    qsRevealLightstrip,
    config
} from "../../../lib/config";
import icons from "../../../lib/icons";
import { bash } from "../../../lib/utils";

const LightstripMenu = () => {
    return (
        <box
            vertical={true}
            spacing={config.qs.qsRevealLightstripSpacing}
        >
            <box>
                <label
                    label={"Lightstrip Color Menu"}
                    class={"qs-menu-label"}
                    hexpand={true}
                />

                <button
                    class={"fetch-new-ip-button"}
                    onClicked={() => {
    					bash(config.common.commandGetLightstripIp)
                    }}
					halign={Gtk.Align.END}
                >
                    <box>
                        <icon
                            icon={icons.ui.refresh}
                        />
                    </box>
                </button>
            </box>
            <box
                vertical={true}
                spacing={config.qs.qsRevealLightstripSpacing}
                class={"qs-menu-content"}
            >
                <button
                    onClicked={() => {
    					bash(config.common.commandTurnOnLightstrip)
                    }}
                >
                    <box
    					halign={Gtk.Align.CENTER}
                    >
                        <icon
                            icon={icons.nightlight[1]}
                        />
                        <label
                            label={"Turn Light On"}
                        />
                    </box>
                </button>

                <button
                    onClicked={() => {
                        bash(config.common.commandTurnOffLightstrip)
                    }}
                >
                    <box
    					halign={Gtk.Align.CENTER}
                    >
                        <icon
                            icon={icons.powermenu.sleep}
                        />
                        <label
                            label={"Turn Light Off"}
                        />
                    </box>
                </button>
            </box>
        </box>
    );
};

export default () => {
    return (
        <revealer
            transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
            revealChild={qsRevealLightstrip}
        >
            <box class={`menu lightstrip`} vertical={true} >
				<LightstripMenu />
            </box>
        </revealer>
    );
}
