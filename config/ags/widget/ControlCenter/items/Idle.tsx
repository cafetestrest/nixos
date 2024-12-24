import ControlCenterButton from "../ControlCenterButton";
import icons from "../../../lib/icons";
import { bind } from "astal";
import IdleModeService, { profileName } from "../../../service/Idle";

export default () => {
	if (IdleModeService) {
		const profile = bind(IdleModeService, "profile");
		return (
			<ControlCenterButton
				className={"toggles"}
				icon={profile.as((p) => icons.idle[p])}
				label={profile.as((p) => profileName(p))}
				onPrimaryClick={() => {
					if (IdleModeService) {
						IdleModeService.nextProfile()
					};
				}}
				// menuName="profiles"
				connection={[bind(IdleModeService, "profile"), () => IdleModeService?.profile === 1]}
			/>
		);
	} else {
		return (<box></box>)
	}
};
