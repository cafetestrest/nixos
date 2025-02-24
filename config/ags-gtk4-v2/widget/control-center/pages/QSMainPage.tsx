import QSToggles from "../items/QSToggles";
import AudioSlider from "../items/AudioSlider";
import MprisPlayers from "../../media-player/MediaPlayer";
import { SinkButton, SinkRevealer } from "../menu/QSSinksMenu";
import { WeatherSchedule } from "../../weather/Weather";
import { qsWeatherScheduleDays } from "../../common/Variables";
import BrightnessSlider from "../items/BrightnessSlider";

export function QSSpaceBetweenToggles() {
    return (
      <box cssClasses={["toggles-space"]} />
    );
}

export function QSSpaceBetweenToggleBoxes() {
    return (
        <box cssClasses={["toggles-box-space"]} />
    );
}

export default () => {
	return (
		<box
			name="main"
			cssClasses={["qs-main-page"]}
            vertical={true}
		>
            <QSToggles />
            <box>
                <AudioSlider />
                <QSSpaceBetweenToggles />
                <SinkButton />
            </box>
            <box>
                <BrightnessSlider />
            </box>
            <SinkRevealer />
            <WeatherSchedule days={qsWeatherScheduleDays} />
            <MprisPlayers />
        </box>
    );
}
