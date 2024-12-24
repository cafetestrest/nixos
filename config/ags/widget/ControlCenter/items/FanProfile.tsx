import ControlCenterButton from "../ControlCenterButton";
import FanProfilesService, { profileName } from "../../../service/FanProfiles";
import { bind } from "astal";
import icons from "../../../lib/icons";

export default () => {
	if (FanProfilesService) {
		const profile = bind(FanProfilesService, "profile");
		return (
			<ControlCenterButton
				icon={profile.as((p) => icons.powerprofile[p])}
				label={profile.as((p) => profileName(p))}
				onPrimaryClick={() => {
					if (FanProfilesService) FanProfilesService.nextProfile();
				}}
				menuName="profiles"
			/>
		);
	}
};
