import NightlightModeService, { profileName } from "../../../service/NightLightService";
import icons from "../../../lib/icons";
import QSToggle from "./QSToggle";
import { createBinding } from "ags";

export default () => {
    if (NightlightModeService) {
		const profile = createBinding(NightlightModeService, "profile");

        return (
            <QSToggle
                className={profile.as((p) => {
                    if (p !== 0) {
                        return "toggles quick-settings-button active";
                    }
                    return "toggles quick-settings-button";
                })}
                onPrimaryClick={() => NightlightModeService && NightlightModeService.nextProfile()}
                icon={profile.as((p) => icons.nightlight[p])}
                label={profile.as((p) => profileName(p))}
                hasArrow={false}
            />
        );
    } else {
        return (<box visible={false}/>)
    }
}
