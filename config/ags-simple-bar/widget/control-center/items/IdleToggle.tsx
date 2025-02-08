import { bind } from "astal"
import IdleModeService, { profileName } from "../../../service/IdleService";
import icons from "../../../lib/icons";
import { Gtk } from "astal/gtk3";
import { referenceWord, padLength } from "../../common/Variables";

export default () => {
    if (IdleModeService) {
		const profile = bind(IdleModeService, "profile");
        const hasArrow = false;

        return (
            <button
                className={bind(profile.as((p) => {
                    if (p !== 0) {
                        return "toggles control-center-button active";
                    }
                    return "toggles control-center-button";
                }))}
                onClicked={() => IdleModeService.nextProfile()}
            >
                <box
    				halign={Gtk.Align.FILL}
                >
                    <icon
                        icon={profile.as((p) => icons.idle[p])}
                    />
                    <label
                        halign={Gtk.Align.START}
                        label={profile.as((p) => padLength(referenceWord, profileName(p)))}
                        hexpand
                    />
                    {hasArrow && (
                        <icon
                            halign={Gtk.Align.END}
                            icon={icons.ui.arrow.right}
                        />
                    )}
                </box>
            </button>
        );
    } else {
        return (<box visible={false}/>)
    }
}
