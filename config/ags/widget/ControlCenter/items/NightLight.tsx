import ControlCenterButton from "../ControlCenterButton";
import icons from "../../../lib/icons";
import { bind } from "astal";
import NightlightModeService, { profileName } from "../../../service/NightLight";

export default () => {
	if (NightlightModeService) {
		const profile = bind(NightlightModeService, "profile");
		return (
			<ControlCenterButton
				className={"toggles"}
				icon={profile.as((p) => icons.nightlight[p])}
				label={profile.as((p) => profileName(p))}
				onPrimaryClick={() => {
					if (NightlightModeService) {
						NightlightModeService.nextProfile()
					};
				}}
				// menuName="profiles"
				connection={[profile, () => NightlightModeService?.profile !== 0]}
			/>
		);
	} else {
		return (<box></box>)
	}
};
