import { bind } from "astal"
import NightlightModeService, { profileName } from "../../../service/NightLightService";
import icons from "../../../lib/icons";
import { Gtk } from "astal/gtk3";

export default () => {
    if (NightlightModeService) {
		const profile = bind(NightlightModeService, "profile");
        const hasArrow = false;

        return (
            <button
                className={bind(profile.as((p) => {
                    if (p !== 0) {
                        return "toggles control-center-button active";
                    }
                    return "toggles control-center-button";
                }))}
                onClicked={() => NightlightModeService.nextProfile()}
            >
                <box
    				halign={Gtk.Align.FILL}
                >
                    <icon
                        icon={profile.as((p) => icons.nightlight[p])}
                    />
                    <label
                        halign={Gtk.Align.START}
                        label={profile.as((p) => profileName(p))}
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
