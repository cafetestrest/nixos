import Gtk from "gi://Gtk?version=4.0";
import QSToggles from "./QSToggles";
import AudioSlider from "./items/AudioSlider";
import SinkButton from "./items/SinkButton";
import SinkMenu from "./menu/SinkMenu";
import BrightnessSlider from "./items/BrightnessSlider";
import MediaPlayer from "./items/MediaPlayer";
import { WeatherSchedule } from "../weather/Weather";
import { QuickSettingsWidgets, config } from "../../lib/config";

function AudioSliderBox() {
  return (
    <box
      spacing={config.quickSettings.sliderSpacing}
    >
      <AudioSlider />
      <SinkButton />
    </box>
  );
}

function BrightnessSliderBox() {
  return (
    <box
      spacing={config.quickSettings.sliderSpacing}
    >
      <BrightnessSlider />
    </box>
  );
}

const widgetMap: Record<QuickSettingsWidgets, JSX.Element> = {
  QSToggles: QSToggles(),
  AudioSliderBox: AudioSliderBox(),
  BrightnessSliderBox: BrightnessSliderBox(),
  SinkMenu: SinkMenu(),
  WeatherSchedule: WeatherSchedule({ days: config.weather.days }),
  MediaPlayer: MediaPlayer(),
};

const renderWidgets = (widgetKeys: QuickSettingsWidgets[]) => widgetKeys.map(key => widgetMap[key] || null);

export default () => {
  return (
    <box
      cssClasses={["qs-main-page"]}
      orientation={Gtk.Orientation.VERTICAL}
    >
      {renderWidgets(config.quickSettings.layout)}
    </box>
  )
}
