import IdleModeService, { profileName } from "../../../service/IdleService";
import icons from "../../../lib/icons";
import QSToggle from "./QSToggle";
import { createBinding } from "ags";

export default () => {
    if (IdleModeService) {
		const profile = createBinding(IdleModeService, "profile");

        return (
            <QSToggle
                className={profile.as((p) => {
                    if (p !== 0) {
                        return "toggles control-center-button active";
                    }
                    return "toggles control-center-button";
                })}
                onPrimaryClick={() => IdleModeService && IdleModeService.nextProfile()}
                icon={profile.as((p) => icons.idle[p])}
                label={profile.as((p) => profileName(p))}
                hasArrow={false}
            />
        );
    } else {
        return (<box visible={false}/>)
    }
}
