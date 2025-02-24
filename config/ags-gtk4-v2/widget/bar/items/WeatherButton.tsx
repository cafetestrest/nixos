import { bind } from "astal";
import { App, Gdk, hook } from "astal/gtk4";
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
        onButtonPressed={(_, event: Gdk.ButtonEvent) => {
            switch (event.get_button()) {
                case Gdk.BUTTON_SECONDARY:
                case Gdk.BUTTON_MIDDLE:
                    weather.stopWatch(); // this kills the subprocess
                    weather.stopPoll();
                    weather.startPoll();
            }
        }}
        cssClasses={["weather", "bar-button"]}
        onDestroy={() => weather.drop()}
        label={weatherData}
        visible={weatherBind.as((w) => w !== null && w.length > 0)}
        setup={(self) => {
            const window = App.get_window(namespaceWeather);
            if (window) {
                hook(self, window, "notify::visible", () => {
                    self[window.visible ? "add_css_class" : "remove_css_class"]("active");
                });
            }
        }}
    />
}
