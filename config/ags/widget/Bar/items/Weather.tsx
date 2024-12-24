import { bind } from "astal";
import { App, Gtk, Gdk } from "astal/gtk3";
import { weather } from "../../../service/Weather";
import { toggleWindow } from "../../../lib/utils";
import BarButton from "../BarButton";

export default () => {
	const weatherData = bind(weather).as((w) => {
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

	return (
		<revealer
			transitionType={Gtk.RevealerTransitionType.CROSSFADE}
			transitionDuration={300}
			revealChild={weatherData.as(Boolean)}
			visible={weatherData.as(Boolean)}
		>
			<BarButton
				className={"weather-button"}
				onClicked={() => {
					toggleWindow("weather");
				}}
				onClickRelease={(self, event) => {
					switch (event.button) {
						case Gdk.BUTTON_SECONDARY: // todo check if does work
							weather.startPoll()
							return weather.stopPoll()
						case Gdk.BUTTON_MIDDLE:
							weather.startPoll
							return weather.stopPoll
				}}}
				setup={(self) => {
					const window = App.get_window("weather");
					if (window) {
						self.hook(window, "notify::visible", () => {
							self.toggleClassName("active", window.visible);
						});
					}
				}}
			>
				<label
					className={"weather-label"}
					valign={Gtk.Align.CENTER}
					label={weatherData}
				/>
			</BarButton>
		</revealer>
	);
};

// const WEATHER_SYMBOL: {
// 	[key: string]: string;
// } = {
// 	default: "✨",
// 	Sunny: "🌞",
// 	Clear: "🌙",
// 	"Partly cloudy": "⛅",
// 	Cloudy: "☁️",
// 	Overcast: "🌥",
// 	Mist: "🌫",
// 	"Patchy rain possible": "🌦",
// 	"Patchy rain nearby": "🌦",
// 	"Patchy snow possible": "🌨",
// 	"Patchy sleet possible": "🌧",
// 	"Patchy freezing drizzle possible": "🌧❄️",
// 	"Thundery outbreaks possible": "🌩",
// 	"Blowing snow": "❄️💨",
// 	Blizzard: "🌨💨",
// 	Fog: "🌫",
// 	"Freezing fog": "🌫❄️",
// 	"Patchy light drizzle": "🌦",
// 	"Light drizzle": "🌦",
// 	"Freezing drizzle": "🌧❄️",
// 	"Heavy freezing drizzle": "🌧❄️",
// 	"Patchy light rain": "🌦",
// 	"Light rain": "🌧",
// 	"Moderate rain at times": "🌧",
// 	"Moderate rain": "🌧",
// 	"Heavy rain at times": "🌧🌩",
// 	"Heavy rain": "🌧🌩",
// 	"Light freezing rain": "🌧❄️",
// 	"Moderate or heavy freezing rain": "🌧❄️",
// 	"Light sleet": "🌨",
// 	"Moderate or heavy sleet": "🌨",
// 	"Patchy light snow": "❄️",
// 	"Light snow": "❄️",
// 	"Patchy moderate snow": "❄️",
// 	"Moderate snow": "❄️",
// 	"Patchy heavy snow": "❄️🌨",
// 	"Heavy snow": "❄️🌨",
// 	"Ice pellets": "🧊",
// 	"Light rain shower": "🌦",
// 	"Moderate or heavy rain shower": "🌧",
// 	"Torrential rain shower": "🌧🌩",
// 	"Light sleet showers": "🌨",
// 	"Moderate or heavy sleet showers": "🌨",
// 	"Light snow showers": "🌨",
// 	"Moderate or heavy snow showers": "❄️🌨",
// 	"Light showers of ice pellets": "🧊",
// 	"Moderate or heavy showers of ice pellets": "🧊",
// 	"Patchy light rain with thunder": "⛈",
// 	"Moderate or heavy rain with thunder": "⛈",
// 	"Patchy light snow with thunder": "🌩❄️",
// 	"Moderate or heavy snow with thunder": "🌩❄️",
// };
