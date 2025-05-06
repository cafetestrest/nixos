import Gtk from "gi://Gtk?version=4.0";
import QSToggles from "./QSToggles";
import AudioSlider from "./items/AudioSlider";
import SinkButton from "./items/SinkButton";
import SinkMenu from "./menu/SinkMenu";
import BrightnessSlider from "./items/BrightnessSlider";
import MediaPlayer from "./items/MediaPlayer";
import { WeatherSchedule } from "../weather/Weather";

export default () => {
  return (
    <box
      cssClasses={["qs-main-page"]}
      orientation={Gtk.Orientation.VERTICAL}
    >
      <QSToggles/>
      <box
        spacing={4} //todo
      >
        <AudioSlider />
        <SinkButton />
      </box>
      <box>
        <BrightnessSlider />
      </box>
      <SinkMenu />
      <WeatherSchedule days={5} />
      {/* todo X days in config */}
      <MediaPlayer />
    </box>
  )
}
