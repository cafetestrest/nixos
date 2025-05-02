import Gtk from "gi://Gtk?version=4.0";
import QSToggles from "./QSToggles";
import AudioSlider from "./items/AudioSlider";
import SinkButton from "./items/SinkButton";
import SinkMenu from "./menu/SinkMenu";
import BrightnessSlider from "./items/BrightnessSlider";
import MediaPlayer from "./items/MediaPlayer";
import { WeatherSchedule } from "../weather/Weather";

export default () => {
  const weatherWidget = true ? <WeatherSchedule days={5} /> : <box visible={false} />

  return (
    <box
      cssClasses={["qs-main-page"]}
      orientation={Gtk.Orientation.VERTICAL}
    >
      <QSToggles/>
      <box>
        <AudioSlider />
        <SinkButton />
      </box>
      <box>
        <BrightnessSlider />
      </box>
      <SinkMenu />
      {weatherWidget}
      <MediaPlayer />
    </box>
  )
}
