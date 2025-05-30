import { Gtk } from "ags/gtk4";
import { weather, TooltipItem } from "../../service/WeatherService";
import { getMostCommon } from "../../lib/utils";
import app from "ags/gtk4/app";

type TemperatureData = {
	minTemp: number;
	maxTemp: number;
	rain: number;
	icons: string[];
	widgetsNumber: number;
	data: TooltipItem[];
};

type IconTemperatureData = {
	minTemp: number;
	maxTemp: number;
	rain: number;
	icons: string[];
	widgetsNumber: number;
	data: TooltipItem[];
};

// todo add types
function weatherBackgroundStyle(icon: string, box) {
	const classSelector = box.get_css_classes().join('.');
	let boxCss = "";

    switch (icon) {
        case "🌇": {//sunset
            boxCss = `
                background: linear-gradient(to bottom, #ff6f61, #ffca58, #f0e68c);
                color: #000000;
            `;
            break;
        }
        case "🌄": {//sunrise
            boxCss = `
                background: linear-gradient(to bottom, #ffcc00, #ff6f61, #ff5e62, #d55f74);
                color: #000000;
            `;
            break;
        }
        case "🌤": {//few clouds
            boxCss = `
                background: linear-gradient(to bottom, #80b3ff, #ffffff, #ffdb4d);
                color: #000000;
            `;
            break;
        }
        case "🌩": {//thunderstorm
            boxCss = `
                background: linear-gradient(to bottom, #0c0e23, #1a1c38, #121320, #0c0e23);
                color: #ffffff;
            `;
            break;
        }
        case "🌑": {
            boxCss = `
                background: linear-gradient(to bottom, #2c3e50, #1a2533);
                color: #ffffff;
            `;
            break;
        }
        case "🌕": {
            boxCss = `
                background: linear-gradient(to bottom, #001f3f, #002f4f, #003f5f, #004f6f, #005f7f);
                color: #ffffff;
            `;
            break;
        }
        case "☀️": {
            boxCss = `
                background: linear-gradient(to bottom, #ffeb99, #ffe580, #ffd866, #ffcf4c, #ffc333);
                color: #000000;
            `;
            break;
        }
        case "☁":
        case "☁️": {//cloudy
            boxCss = `
                background: linear-gradient(to bottom, #c4c4c4, #d1d1d1, #dedede, #ebebeb, #f8f8f8);
                color: #000000;
            `;
            break;
        }
        case "": {
            boxCss = `
                background: linear-gradient(to bottom, #1c2331, #212a38, #263141, #2b3749, #303d51);
                color: #ffffff;
            `;
            break;
        }
        case "": {//fog
            boxCss = `
                background: linear-gradient(to bottom, #d8d8d8, #e2e2e2, #ececec, #f6f6f6, #ffffff);
                color: #000000;
            `;
            break;
        }
        case "": {
            boxCss = `
                background: linear-gradient(to bottom, #1c2331, #1c2331, #1c2331, #293547, #38475f);
                color: #ffffff;
            `;
            break;
        }
        case "⛈️": {//heavy rain
            boxCss = `
                background: linear-gradient(to bottom, #2c3e50, #34495e, #2c3e50, #34495e, #2c3e50);
                color: #000000;
            `;
            break;
        }
        case "󰙾": {
            boxCss = `
                background: linear-gradient(to bottom, #050818, #070b1d, #0a0e22, #0d1126, #10152b);
                color: #ffffff;
            `;
            break;
        }
        case "🌦️": {//light rain
            boxCss = `
                background: linear-gradient(to bottom, #547aad, #6692b8, #78a9c3, #8abfd0, #9cd7dd);
                color: #000000;
            `;
            break;
        }
        case "": {
            boxCss = `
                background: linear-gradient(to bottom, #0e1620, #121c2a, #162133, #18273c, #1c2c46);
                color: #ffffff;
            `;
            break;
        }
        case "⛅": {//partly cloudy
            boxCss = `
                background: linear-gradient(to bottom, #a8c9f0, #c4dfea, #f0f0cc, #ffd700, #f0f0cc, #c4dfea, #a8c9f0);
                color: #000000;
            `;
            break;
        }
        case "": {
            boxCss = `
                background: linear-gradient(to bottom, #040d1c, #081427, #0c1a32, #101f3d, #142348);
                color: #ffffff;
            `;
            break;
        }
        case "🌧️": {//rain showers
            boxCss = `
                background: linear-gradient(to bottom, #5e7d99, #6a8ba6, #7698b3, #87a5bf, #97b3cb, #a6c0d8, #b4cedf);
                color: #000000;
            `;
            break;
        }
        case "": {
            boxCss = `
                background: linear-gradient(to bottom, #050818, #070b1d, #0a0e22, #0d1126, #10152b);
                color: #ffffff;
            `;
            break;
        }
        case "🌨": {//snow
            boxCss = `
                background: linear-gradient(to bottom, #d0e6ec, #e0f0f5, #f0f5f9, #f5fafd, #ffffff);
                color: #000000;
            `;
            break;
        }
        case "": {
            boxCss = `
                background: linear-gradient(to bottom, #0e1620, #162133, #1c263f, #232c4c, #293259);
                color: #ffffff;
            `;
            break;
        }
        case "🌨️": {//sleet
            boxCss = `
                background: linear-gradient(to bottom, #d0e6ec, #e0f0f5, #f0f5f9, #ffffff, #f0f5f9, #e0f0f5, #d0e6ec);
                color: #000000;
            `;
            break;
        }
        case "": {
            boxCss = `
                background: linear-gradient(to bottom, #050818, #08142a, #0c1d3b, #101f47, #142556);
                color: #ffffff;
            `;
            break;
        }
        default: {
            boxCss = `
                background: red;
                color: blue;
            `;
            break;
        }
    }

	app.apply_css(`.${classSelector} { ${boxCss} }`);
}

const WeatherBoxChild = (w: TooltipItem) => (
	<box
		cssClasses={["qs-weather-box-child"]}
		orientation={Gtk.Orientation.VERTICAL}
		hexpand={true}
		children={[
			<label label={w.hour + "h"} cssClasses={["weather-hour"]} />,
			<label label={w.icon} cssClasses={["weather-icon"]} />,
			<label label={w.temperature} cssClasses={["weather-temperature"]} />,
			w.rain != '0 mm' ? <label label={w.rain} cssClasses={["weather-rain"]} /> : <label />,
			<label label={"  " + Math.round(Number(w.wind.replace(/kph$/, ''))) + ' kph'} cssClasses={["weather-wind"]} />,
		]}
	>
	</box>
);

const WeatherBoxChildWrapper = (w: TooltipItem, temperatureDataPerDay: Record<string, TemperatureData>, totalWeatherForecastDataArray: TooltipItem[]) => (
	<box
		cssClasses={["qs-weather-box-child-wrapper"]}
		hexpand={true}
		$={self => {
			let useTotalInstead = false;

			if (totalWeatherForecastDataArray.length) {
				useTotalInstead = true;

				totalWeatherForecastDataArray.forEach(totalEl => {
					self.append(
						WeatherBoxChild(totalEl),
					)
				})
			}

			if (false === useTotalInstead && w && temperatureDataPerDay && temperatureDataPerDay[w.date.substring(0, 3).toUpperCase()].data.length) {
				temperatureDataPerDay[w.date.substring(0, 3).toUpperCase()].data.forEach(el => {
					self.append(
						WeatherBoxChild(el),
					)
				})
			}
		}}
	>
	</box>
);

const WeatherMainWidget = (widgetIcon: string, widgetDate: string, rain:number, temperatureDataPerDay: Record<string, TemperatureData>, w: TooltipItem, totalWeatherForecastDataArray: TooltipItem[]) => (
	<box
		cssClasses={["qsweather-widget"]}
		orientation={Gtk.Orientation.VERTICAL}
		hexpand={true}
		children={[
			<box
				cssClasses={["qs-weather-box-main"]}
				children={[
					<label label={widgetIcon} cssClasses={["weather-icon"]} />,
					rain != 0 ? <label label={rain + 'mm'} cssClasses={["weather-rain"]} /> : <label />,
					<box hexpand={true} />,
					<label label={'↑ ' + temperatureDataPerDay[widgetDate.substring(0, 3).toUpperCase()].maxTemp + '  '} cssClasses={["weather-max"]} />,
					<label label={'↓ ' + temperatureDataPerDay[widgetDate.substring(0, 3).toUpperCase()].minTemp + '  '} cssClasses={["weather-min"]} />,
					<label label={widgetDate.substring(0, 3).toUpperCase()} cssClasses={["weather-hour"]} />,
				]}
			>
			</box>,
			WeatherBoxChildWrapper(w, temperatureDataPerDay, totalWeatherForecastDataArray)
		]}
		$={self => {
			weatherBackgroundStyle(widgetIcon, self);
        }}
	>
	</box>
)

const WeatherInfo = (weatherData: TooltipItem) => (
	<box
		cssClasses={["weather-info"]}
		orientation={Gtk.Orientation.VERTICAL}
		children={[
			<label label={weatherData.date.substring(0, 3).toUpperCase()}/>,
			<label label={weatherData.hour + 'h'}/>,
			<label />,
			<label label={weatherData.icon} cssClasses={["weather-icon"]}/>,
			<label label={weatherData.temperature} cssClasses={["weather-temperature"]}/>,
			weatherData.rain != '0 mm' ? <label label={weatherData.rain} /> : <label />,
			<label label={'↑ ' + weatherData.maxTemp} cssClasses={["weather-max"]}/>,
			<label label={'↓ ' + weatherData.minTemp} cssClasses={["weather-min"]}/>,
		]}
		$={self => {
			weatherBackgroundStyle(weatherData.icon, self)
        }}
	>
	</box>
);

export const WeatherSchedule = ({ days }: { days: number|null }) => (<box
	cssClasses={["weather"]}
	$destroy={() => weather.destroy()}
	$={(self) => {
		weather.subscribe(() => {
			let tooltip = weather.get();
			if (tooltip) {
				// Clear previous children and add the new ones
				for (const widget of self) {
					widget.unparent();
				}

				let prevDayName: string|null = null;
				let temperatureDataPerDay: Record<string, IconTemperatureData> = {};
				let weatherStatusIconArray: string[] = [];
				let weatherForecastDataArray: TooltipItem[] = [];
				let totalWeatherForecastDataArray: TooltipItem[] = [];

				let totalWeatherForecastsCounter = days;
				let forecastWidgetsNumber = 0;

				tooltip.forEach(w => {
					if (w.indicator) {
						return;
					}

					if (w.date !== prevDayName) {
						weatherStatusIconArray = [];
						prevDayName = w.date;
						forecastWidgetsNumber = 0;
						weatherForecastDataArray = [];
					}

					// used to retrieve min/max temp per day
					const date = w.date.substring(0, 3).toUpperCase();
					const temperature = parseInt(w.temperature);

					const rain = w.rain.replace(/ mm$/, '');
					forecastWidgetsNumber = forecastWidgetsNumber + 1;

					weatherForecastDataArray.push(w);

					if (days && totalWeatherForecastsCounter && totalWeatherForecastsCounter > 0) {
						totalWeatherForecastDataArray.push(w);
						totalWeatherForecastsCounter = totalWeatherForecastsCounter - 1;
					}

					// If the date is not already in the object, initialize it
					if (!temperatureDataPerDay[date]) {
						temperatureDataPerDay[date] = {
						minTemp: temperature,
						maxTemp: temperature,
						rain: Number(rain),
						icons: [],
						widgetsNumber: forecastWidgetsNumber,
						data: weatherForecastDataArray,
						};
					} else {
						// Update min and max temperatures if necessary
						temperatureDataPerDay[date].minTemp = Math.min(temperatureDataPerDay[date].minTemp, temperature);
						temperatureDataPerDay[date].maxTemp = Math.max(temperatureDataPerDay[date].maxTemp, temperature);
						temperatureDataPerDay[date].rain = Math.max(temperatureDataPerDay[date].rain, Number(rain));
						temperatureDataPerDay[date].icons = weatherStatusIconArray;
						temperatureDataPerDay[date].widgetsNumber = forecastWidgetsNumber;
						temperatureDataPerDay[date].data = weatherForecastDataArray;
					}

					// Get the current month (0 = January, 11 = December)
					const currentMonth = new Date().getMonth();

					// Check if it is winter (December, January, February)
					const isWinter = currentMonth === 11 || currentMonth === 0 || currentMonth === 1;

					const startHour = 7;
					const endHour = isWinter ? 15 : 19;

					// add icon to the array in between somewhat sunny hours, used to later get most common icon for main widget days
					if (Number(w.hour) >= startHour && Number(w.hour) <= endHour) {
						weatherStatusIconArray.push(w.icon);
					}
				});

				// clear for next loop
				prevDayName = null;

				let widgetIcon = null;
				let widgetDate = null;

				let w = null;
				for (let i = 0; i < tooltip.length; i++) {
					w = tooltip[i];

					if (w.indicator) {
						continue;
					}

					// used to limit forecast to specified amount (if total variable is provided, it will display that amount of forecast widgets on a main one)
					if (days && days >= 0) {

						if (!widgetIcon) {
							widgetIcon = w.icon;
						}

						if (!widgetDate) {
							widgetDate = w.date;
						}

						const rain = temperatureDataPerDay[widgetDate.substring(0, 3).toUpperCase()].rain;

						self.append(
							WeatherMainWidget(widgetIcon, widgetDate, rain, temperatureDataPerDay, w, totalWeatherForecastDataArray)
						);
						break;
					}

					// if provided date differs to previous day name, by default prevDayName is null
					if (w.date !== prevDayName && i > 0) {
						// adds spacing to the widgets
						self.append(
							<box>
								<label label={" "} cssClasses={["weather-spacing"]}/>
							</box>
						);
					}

					// logic that determines if the widget contains just 1 forecast widget, if so it will display it in a smaller widget - like the one for the forecast days
					if (temperatureDataPerDay[w.date.substring(0, 3).toUpperCase()].widgetsNumber === 1) {
						prevDayName = w.date;

						self.append(WeatherInfo(w));
						continue;
					}

					// this one creates main one - wide weather widget that contains smaller forecast widgets
					if (w.date !== prevDayName) {
						const rain = temperatureDataPerDay[w.date.substring(0, 3).toUpperCase()].rain;
						let icon = getMostCommon(temperatureDataPerDay[w.date.substring(0, 3).toUpperCase()].icons);
						widgetDate = w.date;

						if (!icon) {
							icon = w.icon;
						}

						widgetIcon = icon;

						self.append(
							WeatherMainWidget(widgetIcon, widgetDate, rain, temperatureDataPerDay, w, [])
						);
					}

					prevDayName = w.date;
				};
			}
		});
	}}
>
</box>)
