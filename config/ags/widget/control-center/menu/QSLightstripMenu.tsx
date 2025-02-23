import { Gtk } from "astal/gtk3";
import {
    qsRevealLightstrip,
    qsRevealLightstripSpacing,
    commandGetLightstripIp,
    commandTurnOnLightstrip,
    commandTurnOffLightstrip
} from "../../common/Variables";
import icons from "../../../lib/icons";
import QSMenu from "./QSMenu";
import { bash } from "../../../lib/utils";

const LightstripMenu = () => {
    return (
        <box
            vertical={true}
            spacing={qsRevealLightstripSpacing}
        >
            <box>
                <label
                    label={"Lightstrip Color Menu"}
                    className={"qs-menu-label"}
                    hexpand={true}
                />

                <button
                    className={"fetch-new-ip-button"}
                    onClicked={() => {
    					bash(commandGetLightstripIp)
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
                spacing={qsRevealLightstripSpacing}
                className={"qs-menu-content"}
            >
                <button
                    onClicked={() => {
    					bash(commandTurnOnLightstrip)
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
                        bash(commandTurnOffLightstrip)
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
		<QSMenu
			classname={"screenshot"}
			bindVariable={qsRevealLightstrip}
			content={[
				<LightstripMenu />
			]}
		/>
	);
}
