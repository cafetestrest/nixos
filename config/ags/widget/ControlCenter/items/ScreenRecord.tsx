import { bind } from "astal";
import icons from "../../../lib/icons";
import ScreenRecordService from "../../../service/ScreenRecord";
import ControlCenterButton from "../ControlCenterButton";

export default ({ onClicked }: { onClicked: () => void }) => {
	return (
		<ControlCenterButton
			className={"recorder-indicator toggles"}
			icon={icons.record}
			label={"Screen record"}
			onPrimaryClick={onClicked}
			connection={[
				bind(ScreenRecordService, "recording"),
				() => ScreenRecordService.recording,
			]}
			onKeyReleaseEvent={(_, event) => {
				const [keyEvent, keyCode] = event.get_keycode();

				if (keyEvent && (keyCode === 36 || keyCode === 65 || keyCode === 104)) { //65:space, 36:return, 104:num return
					onClicked()
				}
			}}
			menuName="arrow"
		/>
	);
};
