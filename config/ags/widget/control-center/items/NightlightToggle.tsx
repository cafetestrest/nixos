import { bind } from "astal";
import NightlightModeService, { profileName } from "../../../service/NightLightService";
import icons from "../../../lib/icons";
import QSToggle from "./QSToggle";

export default () => {
    if (NightlightModeService) {
		const profile = bind(NightlightModeService, "profile");

        return (
            <QSToggle
                className={bind(profile.as((p) => {
                    if (p !== 0) {
                        return "toggles control-center-button active";
                    }
                    return "toggles control-center-button";
                }))}
                onPrimaryClick={() => NightlightModeService.nextProfile()}
                icon={profile.as((p) => icons.nightlight[p])}
                label={profile.as((p) => profileName(p))}
                hasArrow={false}
            />
        );
    } else {
        return (<box visible={false}/>)
    }
}
