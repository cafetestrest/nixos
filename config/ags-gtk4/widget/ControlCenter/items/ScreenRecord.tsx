import { bind } from "astal";
import icons from "../../../lib/icons";
import ScreenRecordService from "../../../service/ScreenRecord";
import ControlCenterButton from "../ControlCenterButton";
import { Gdk } from "astal/gtk4";

export default ({ onClicked }: { onClicked: () => void }) => {
	return (
		<ControlCenterButton
			className="recorder-indicator" //TODOfix idk toggles classname?
			icon={icons.record}
			label={"Screen record"}
			onPrimaryClick={onClicked}
			connection={[
				bind(ScreenRecordService, "recording"),
				() => ScreenRecordService.recording,
			]}
			onKeyPressed={(_, keyval) => {
				if (keyval === Gdk.KEY_Return || keyval === Gdk.KEY_space || keyval === Gdk.KEY_KP_Enter) {
					onClicked()
				}
			}}
			menuName="arrow"
		/>
	);
};
