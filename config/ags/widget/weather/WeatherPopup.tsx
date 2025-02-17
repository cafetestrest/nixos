import { App, Astal, Gdk } from "astal/gtk3"
import {
    weatherBoxTopMargin,
    weatherContentWidth,
    weatherWidth,
    namespaceWeather
} from "../common/Variables"
import { WeatherSchedule } from "./Weather"

function hide() {
    App.get_window(namespaceWeather)!.hide()
}

export default function WeatherPopup() {
    return <window
        name={namespaceWeather}
        namespace={namespaceWeather}
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM}
        exclusivity={Astal.Exclusivity.IGNORE}
        keymode={Astal.Keymode.ON_DEMAND}
        application={App}
        visible={false}
        onShow={(self) => {
            weatherWidth.set(self.get_current_monitor().workarea.width)
        }}
        onKeyPressEvent={function (self, event: Gdk.Event) {
            if (event.get_keyval()[1] === Gdk.KEY_Escape)
                self.hide()
        }}>
        <box className={"Popup"}>
            <eventbox widthRequest={weatherWidth(w => w / 2)} expand={true} onClick={hide} />
            <box hexpand={false} vertical={true}>
                <eventbox heightRequest={weatherBoxTopMargin} onClick={hide} />
                <box widthRequest={weatherContentWidth} className={"popup-box"} vertical={true}>
                    <box className={"weather-popup-box"}>
                        <WeatherSchedule days={null} />
                    </box>
                </box>
                <eventbox expand={true} onClick={hide} />
            </box>
            <eventbox widthRequest={weatherWidth(w => w / 2)} expand={true} onClick={hide} />
        </box>
    </window>
}
