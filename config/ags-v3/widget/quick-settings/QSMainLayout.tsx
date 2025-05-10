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
      cssClasses={["audio-sliders-box-es"]}
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

function WeatherScheduleBox() {
  return (
    <box
      marginBottom={config.quickSettings.sliderSpacing}
    >
      <WeatherSchedule days={config.weather.days} />
    </box>
  );
}

const widgetMap: Record<QuickSettingsWidgets, JSX.Element> = {
  QSToggles: QSToggles(),
  AudioSliderBox: AudioSliderBox(),
  BrightnessSliderBox: BrightnessSliderBox(),
  SinkMenu: SinkMenu(),
  WeatherSchedule: WeatherScheduleBox(),
  MediaPlayer: MediaPlayer(),
};

const widgetsWithoutSpacings: QuickSettingsWidgets[] = [
  "WeatherSchedule",
  "MediaPlayer",
  "SinkMenu",
];

const renderWidgets = (widgetKeys: QuickSettingsWidgets[]) => {
  return widgetKeys.map((key, index) => {
    const element = widgetMap[key];
    if (!element) return null;

    if (widgetsWithoutSpacings.includes(key)) return element;

    const isFirst = index === 0;
    const isLast = index === widgetKeys.length - 1;
    const hasBefore = index > 0;
    const hasAfter = index < widgetKeys.length - 1;

    const spacing = config.quickSettings.qsLayoutMarginSpacing;

    const marginTop = !isFirst && hasBefore ? spacing : 0;
    const marginBottom = !isLast && hasAfter ? spacing : 0;

    return (
      <box
        marginTop={marginTop}
        marginBottom={marginBottom}
      >
        {element}
      </box>
    );
  });
};

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
