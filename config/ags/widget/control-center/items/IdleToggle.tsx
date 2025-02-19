import { bind } from "astal";
import IdleModeService, { profileName } from "../../../service/IdleService";
import icons from "../../../lib/icons";
import QSToggle from "./QSToggle";

export default () => {
    if (IdleModeService) {
		const profile = bind(IdleModeService, "profile");

        return (
            <QSToggle
                className={bind(profile.as((p) => {
                    if (p !== 0) {
                        return "toggles control-center-button active";
                    }
                    return "toggles control-center-button";
                }))}
                onPrimaryClick={() => IdleModeService.nextProfile()}
                icon={profile.as((p) => icons.idle[p])}
                label={profile.as((p) => profileName(p))}
                hasArrow={false}
            />
        );
    } else {
        return (<box visible={false}/>)
    }
}
