import { bind } from "astal"
import IdleModeService, { profileName } from "../../../service/IdleService";
import icons from "../../../lib/icons";

export default () => {
    if (IdleModeService) {
		const profile = bind(IdleModeService, "profile");

        return (
            <button
                label={profile.as((p) => profileName(p))}
                onClicked={() => IdleModeService.nextProfile()}
            >
                <icon iconName={profile.as((p) => icons.nightlight[p])} />
            </button>
        );
    } else {
        return (<box visible={false}/>)
    }
}
