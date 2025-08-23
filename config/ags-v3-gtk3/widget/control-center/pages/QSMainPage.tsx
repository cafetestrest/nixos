import QSToggles from "../items/QSToggles";
import AudioSlider from "../items/AudioSlider";
import MprisPlayers from "../../media-player/MediaPlayer";
import { SinkButton, SinkRevealer } from "../menu/QSSinksMenu";
import { WeatherSchedule } from "../../weather/Weather";
import { qsWeatherScheduleDays, qsShowWeatherSchedule } from "../../common/Variables";
import BrightnessSlider from "../items/BrightnessSlider";

export function QSSpaceBetweenToggles() {
    return (
      <box class={"toggles-space"} />
    );
}

export default () => {
    // const weatherWidget = qsShowWeatherSchedule ? <WeatherSchedule days={qsWeatherScheduleDays} /> : <box visible={false} />
    //todo add weather

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
            {/* {weatherWidget} */}
            {/* todo add weather */}
            <MprisPlayers />
        </box>
    );
}
