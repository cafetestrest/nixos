import { bind } from "astal"
import NightlightModeService, { profileName } from "../../../service/NightLightService";
import icons from "../../../lib/icons";

export default () => {
    if (NightlightModeService) {
		const profile = bind(NightlightModeService, "profile");

        return (
            <button
                label={profile.as((p) => profileName(p))}
                onClicked={() => NightlightModeService.nextProfile()}
            >
                <icon iconName={profile.as((p) => icons.nightlight[p])} />
            </button>
        );
    } else {
        return (<box visible={false}/>)
    }
}
