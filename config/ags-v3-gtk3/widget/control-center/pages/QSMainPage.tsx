import QSToggles from "../items/QSToggles";
import AudioSlider from "../items/AudioSlider";
import MprisPlayers from "../../media-player/MediaPlayer";
import { SinkButton, SinkRevealer } from "../menu/QSSinksMenu";
import { WeatherSchedule } from "../../weather/Weather";
import { config, QuickSettingsWidgets } from "../../../lib/config";
import BrightnessSlider from "../items/BrightnessSlider";

export function QSSpaceBetweenToggles() {
    return (
      <box class={"toggles-space"} />
    );
}

export default () => {
    const widgetMap: Record<QuickSettingsWidgets, JSX.Element> = {
        QSToggles: QSToggles(),
        AudioSliderBox: (
            <box>
                <AudioSlider />
                <QSSpaceBetweenToggles />
                <SinkButton />
            </box>
        ),
        BrightnessSliderBox: (
            <box>
                <BrightnessSlider />
            </box>
        ),
          SinkMenu: SinkRevealer(),
          WeatherSchedule: WeatherSchedule({ days: config.weather.days }),
          MediaPlayer: MprisPlayers(),
    };

    const renderWidgets = (widgetKeys: QuickSettingsWidgets[]) => {
        return widgetKeys.map((key, index) => {
            const widget = widgetMap[key];
            return widget ? widget : null;
        });
    };

	return (
		<box
			name="main"
			class={"qs-main-page"}
            vertical={true}
			$type="named"
		>
            {renderWidgets(config.qs.layout)}
        </box>
    );
}
