import { Astal, Gdk } from "ags/gtk3";
import App from "ags/gtk3/app";
import {
    weatherBoxTopMargin,
    weatherContentWidth,
    weatherWidth,
    setWeatherWidth,
    namespaceWeather
} from "../common/Variables";
import { WeatherSchedule } from "./Weather";

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
            setWeatherWidth(self.get_current_monitor().workarea.width)
        }}
        onKeyPressEvent={function (self, e) {
            const event = e as unknown as Gdk.Event;
            if (event.get_keyval()[1] === Gdk.KEY_Escape)
                self.hide()
        }}>
        <box class={"popover"}>
            <eventbox widthRequest={weatherWidth(w => w / 2)} expand={true} onClick={hide} />
            <box hexpand={false} vertical={true}>
                <eventbox heightRequest={weatherBoxTopMargin} onClick={hide} />
                <box widthRequest={weatherContentWidth} class={"popup-box"} vertical={true}>
                    <box class={"weather-popup-box"}>
                        <WeatherSchedule days={null} />
                    </box>
                </box>
                <eventbox expand={true} onClick={hide} />
            </box>
            <eventbox widthRequest={weatherWidth(w => w / 2)} expand={true} onClick={hide} />
        </box>
    </window>
}
