import QSToggles from "../items/QSToggles";
import AudioSlider from "../items/AudioSlider";
import MprisPlayers from "../../media-player/MediaPlayer";
import { SinkButton, SinkRevealer } from "../menu/QSSinksMenu";
import { WeatherSchedule } from "../../weather/Weather";
import { config } from "../../../lib/config";
import BrightnessSlider from "../items/BrightnessSlider";

export function QSSpaceBetweenToggles() {
    return (
      <box class={"toggles-space"} />
    );
}

export default () => {
	return (
		<box
			name="main"
			class={"qs-main-page"}
            vertical={true}
			$type="named"
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
            <WeatherSchedule days={config.weather.qsWeatherScheduleDays} />
            <MprisPlayers />
        </box>
    );
}
