import { bind } from "astal";
import { App, Gdk } from "astal/gtk3";
import { namespaceWeather } from "../../common/Variables";
import { weather } from "../../../service/WeatherService";

export default () => {
    const weatherBind = bind(weather);
    const weatherData = weatherBind.as((w) => {
		let tooltip = weather.get();
		let indicator = "";

		if (!tooltip)
			return indicator;

		tooltip.forEach(w => {
			if (w.indicator)
				indicator = w.indicator
		});

		return indicator;
	});

    return <button
        onClicked={() => App.toggle_window(namespaceWeather)}
        onClickRelease={(self, event) => {
            switch (event.button) {
                case Gdk.BUTTON_SECONDARY:
                case Gdk.BUTTON_MIDDLE:
                    weather.stopWatch(); // this kills the subprocess
                    weather.stopPoll();
                    weather.startPoll();
            }
        }}
        className={"weather bar-button"}
        onDestroy={() => weather.drop()}
        label={weatherData}
        visible={weatherBind.as((w) => w && w.length > 0)}
        setup={(self) => {
            const window = App.get_window(namespaceWeather);
            if (window) {
                self.hook(window, "notify::visible", () => {
                    self.toggleClassName("active", window.visible);
                });
            }
        }}
    />
}
