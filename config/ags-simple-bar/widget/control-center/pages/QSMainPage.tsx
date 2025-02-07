import QSToggles from "../items/QSToggles";
import AudioSlider from "../items/AudioSlider";
import MprisPlayers from "../../media-player/MediaPlayer";

export default () => {
	return (
		<box
			name="main"
			className="qs-main-page"
            vertical={true}
		>
            <QSToggles />
            <AudioSlider />
            <MprisPlayers />
        </box>
    );
}