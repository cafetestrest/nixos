import icons from "../../../lib/icons";
import QSToggle from "./QSToggle";
import ColorModeService, { profileName } from "../../../service/ColorModeService";
import { createBinding } from "ags";

export default () => {
    if (ColorModeService) {
		const profile = createBinding(ColorModeService, "profile");

        return (
            <QSToggle
                className={profile.as((p) => {
                    if (p !== 0) {
                        return "toggles control-center-button active";
                    }
                    return "toggles control-center-button";
                })}
                onPrimaryClick={() => ColorModeService && ColorModeService.nextProfile()}
                icon={profile.as((p) => icons.colormode[p])}
                label={profile.as((p) => profileName(p) + " Theme")}
                hasArrow={false}
            />
        );
    } else {
        return (<box visible={false}/>)
    }
}
