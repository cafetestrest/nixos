import Gtk from "gi://Gtk?version=4.0";
import QSToggles from "./QSToggles";
import AudioSlider from "./items/AudioSlider";
import SinkButton from "./items/SinkButton";
import SinkMenu from "./menu/SinkMenu";

export default () => {
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
        {/* <BrightnessSlider /> */}
      </box>
      <SinkMenu />
      {/* {weatherWidget} */}
      {/* <MprisPlayers /> */}
    </box>
  )
}
