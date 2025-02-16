import { bind } from "astal";
import icons from "../../../lib/icons";
import ScreenRecordService from "../../../service/ScreenRecord";
import ControlCenterButton from "../ControlCenterButton";
import { Gdk } from "astal/gtk3";

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
				const key = event.get_keyval()[1];
				if (key === Gdk.KEY_Return || key === Gdk.KEY_space || key === Gdk.KEY_KP_Enter) {
					onClicked()
				}
			}}
			menuName="arrow"
		/>
	);
};
