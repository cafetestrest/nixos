import { App, Astal, Gdk } from "astal/gtk4";
import {
    weatherBoxTopMargin,
    weatherContentWidth,
    weatherWidth,
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
            weatherWidth.set(self.get_current_monitor().workarea.width)
        }}
        onKeyPressed={(_, keyval: number) => {
            if (keyval === Gdk.KEY_Escape)
                hide()
        }}>
        <box cssClasses={["Popup"]}>
            <box widthRequest={weatherWidth(w => w / 2)} hexpand={true} vexpand={true} onClick={hide} />
            <box hexpand={false} vertical={true}>
                <box heightRequest={weatherBoxTopMargin} onClick={hide} />
                <box widthRequest={weatherContentWidth} cssClasses={["popup-box"]} vertical={true}>
                    <box cssClasses={["weather-popup-box"]}>
                        <WeatherSchedule days={null} />
                    </box>
                </box>
                <box hexpand={true} vexpand={true} onClick={hide} />
            </box>
            <box widthRequest={weatherWidth(w => w / 2)} hexpand={true} vexpand={true} onClick={hide} />
        </box>
    </window>
}
