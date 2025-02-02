import { App, Astal, Gdk, Gtk, hook } from "astal/gtk4";
import PopupWindow from "../../common/PopupWindow";
import { weather, TooltipItem } from "../../service/Weather";

export const namespace = "weather";

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

function getMostCommon<T>(arr: T[]): T | undefined {
    return arr.sort((a,b) =>
          arr.filter(v => v===a).length
        - arr.filter(v => v===b).length
    ).pop();
}

function weatherIconToClassname(icon: string) {
	let classname;

    switch (icon) {
        case "🌇": {//sunset
            classname = "sunset";
            break;
        }
        case "🌄": {//sunrise   
            classname = "sunrise";
            break;
        }
        case "🌤": {//few clouds
            classname = "few-clouds";
            break;
        }
        case "🌩": {//thunderstorm
            classname = "thunderstorm";
            break;
        }
        case "🌑": {
            classname = "clear-night";
            break;
        }
        case "🌕": {
            classname = "clear-night2";
            break;
        }
        case "☀️": {
            classname = "sun";
            break;
        }
        case "☁":
        case "☁️": {//cloudy
            classname = "cloudy";
            break;
        }
        case "": {
            classname = "cloudy-night";
            break;
        }
        case "": {//fog
            classname = "fog";
            break;
        }
        case "": {
            classname = "fog-night";
            break;
        }
        case "⛈️": {//heavy rain
            classname = "heavy-rain";
            break;
        }
        case "󰙾": {
            classname = "heavy-rain-night";
            break;
        }
        case "🌦️": {//light rain
            classname = "light-rain";
            break;
        }
        case "": {
            classname = "rain-night";
            break;
        }
        case "⛅": {//partly cloudy
            classname = "partly-cloudy";
            break;
        }
        case "": {
            classname = "partly-cloudy-night";
            break;
        }
        case "🌧️": {//rain showers
            classname = "rain-showers";
            break;
        }
        case "": {
            classname = "rainshowers-night";
            break;
        }
        case "🌨": {//snow
            classname = "snow";
            break;
        }
        case "": {
            classname = "snow-night";
            break;
        }
        case "🌨️": {//sleet
            classname = "sleet";
            break;
        }
        case "": {
            classname = "sleet-night";
            break;
        }
        default: {
            classname = "unknown";
            break;
        }
    }
	return classname;
}

const WeatherBoxChild = (w: TooltipItem) => (
	<box
		cssClasses={["qs-weather-box-child"]}
		vertical={true}
		hexpand={true}
		children={[
			<label label={w.hour + "h"} cssClasses={["weather-hour"]} />,
			<label label={w.icon} cssClasses={["weather-icon"]} />,
			<label label={w.temperature} cssClasses={["weather-temperature"]} />,
			<box vexpand={true} />,
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
		setup={(self) => {
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
		cssClasses={["qsweather-widget", weatherIconToClassname(widgetIcon)]}
		vertical={true}
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
	>
	</box>
)

const WeatherInfo = (weatherData: TooltipItem) => (
	<box
		cssClasses={["weather-info", weatherIconToClassname(weatherData.icon)]}
		vertical={true}
		children={[
			<label label={weatherData.date.substring(0, 3).toUpperCase()}/>,
			<label label={weatherData.hour + 'h'}/>,
			<label label={weatherData.icon} cssClasses={["weather-icon"]}/>,
			<label label={weatherData.temperature} cssClasses={["weather-temperature"]}/>,
			<box vexpand={true} />,
			weatherData.rain != '0 mm' ? <label label={weatherData.rain} /> : <label />,
			<label label={'↑ ' + weatherData.maxTemp} cssClasses={["weather-max"]}/>,
			<label label={'↓ ' + weatherData.minTemp} cssClasses={["weather-min"]}/>,
		]}
	>
	</box>
);

export const Tooltip = ({ total }: { total: number|null }) => (<box
	cssClasses={[namespace]}
	setup={(self) => {
		hook(self, weather, () => {
			let tooltip = weather.get();
			if (tooltip) {
				self.get_children().forEach(ch => ch.unparent());
	
				let prevDayName: string|null = null;
				let temperatureDataPerDay: Record<string, IconTemperatureData> = {};
				let weatherStatusIconArray: string[] = [];
				let weatherForecastDataArray: TooltipItem[] = [];
				let totalWeatherForecastDataArray: TooltipItem[] = [];
	
				let totalWeatherForecastsCounter = total;
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
	
					if (total && totalWeatherForecastsCounter && totalWeatherForecastsCounter > 0) {
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
					if (total && total >= 0) {
	
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

export default () => {
	return (
		<PopupWindow
			className="weather-popup"
			name={namespace}
			namespace={namespace}
			scrimType="transparent"
			anchor={Astal.WindowAnchor.TOP}
			marginTop={12}
			layer={Astal.Layer.OVERLAY}
			exclusivity={Astal.Exclusivity.NORMAL}
			keymode={Astal.Keymode.EXCLUSIVE}
			onKeyPressed={(_, keyval) => {
				if (keyval === Gdk.KEY_Escape) {
					App.toggle_window(namespace);
				}
			}}
		>
			<box cssClasses={["calendar", "block", "weather-popup-box"]} spacing={10}>
				< Tooltip total={null} />
			</box>
		</PopupWindow>
	);
};
