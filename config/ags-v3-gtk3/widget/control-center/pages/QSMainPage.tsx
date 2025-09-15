import QSToggles from "../items/QSToggles";
import AudioSlider from "../items/AudioSlider";
import MprisPlayers from "../../media-player/MediaPlayer";
import { SinkButton, SinkRevealer } from "../menu/QSSinksMenu";
import { WeatherSchedule } from "../../weather/Weather";
import { config } from "../../../lib/config";
import BrightnessSlider from "../items/BrightnessSlider";
import { QuickSettingsWidgets } from "../../../lib/types";

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
                {config.brightness.hasBrightness ? BrightnessSlider() : <box visible={false}/>}
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
            {renderWidgets(config.quicksettings.layout)}
        </box>
    );
}
