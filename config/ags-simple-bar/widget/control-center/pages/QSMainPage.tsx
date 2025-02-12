import QSToggles from "../items/QSToggles";
import AudioSlider from "../items/AudioSlider";
import MprisPlayers from "../../media-player/MediaPlayer";
import { SinkButton, SinkRevealer } from "../menu/QSSinksMenu";

export function QSSpaceBetweenToggles() {
    return (
      <box className={"toggles-space"} />
    );
}

export function QSSpaceBetweenToggleBoxes() {
    return (
        <box className={"toggles-box-space"} />
    );
}

export default () => {
	return (
		<box
			name="main"
			className="qs-main-page"
            vertical={true}
		>
            <QSToggles />
            <box>
                <AudioSlider />
                <QSSpaceBetweenToggles />
                <SinkButton />
            </box>
            <SinkRevealer />
            <MprisPlayers />
        </box>
    );
}
