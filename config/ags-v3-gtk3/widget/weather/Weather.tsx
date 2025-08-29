import { weather, TooltipItem, temperatureDataPerDay, totalWeatherForecastDataArray } from "../../service/WeatherService";
import { For } from "ags";
import { qsShowWeatherSchedule } from "../common/Variables";

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

function weatherBackgroundStyle(icon: string) {
    switch (icon) {
        case "🌇": {//sunset
            return `
                background: linear-gradient(to bottom, #ff6f61, #ffca58, #f0e68c);
                color: #000000;
            `;
            break;
        }
        case "🌄": {//sunrise
            return `
                background: linear-gradient(to bottom, #ffcc00, #ff6f61, #ff5e62, #d55f74);
                color: #000000;
            `;
            break;
        }
        case "🌤": {//few clouds
            return `
                background: linear-gradient(to bottom, #80b3ff, #ffffff, #ffdb4d);
                color: #000000;
            `;
            break;
        }
        case "🌩": {//thunderstorm
            return `
                background: linear-gradient(to bottom, #0c0e23, #1a1c38, #121320, #0c0e23);
                color: #ffffff;
            `;
            break;
        }
        case "🌑": {
            return `
                background: linear-gradient(to bottom, #2c3e50, #1a2533);
                color: #ffffff;
            `;
            break;
        }
        case "🌕": {
            return `
                background: linear-gradient(to bottom, #001f3f, #002f4f, #003f5f, #004f6f, #005f7f);
                color: #ffffff;
            `;
            break;
        }
        case "☀️": {
            return `
                background: linear-gradient(to bottom, #ffeb99, #ffe580, #ffd866, #ffcf4c, #ffc333);
                color: #000000;
            `;
            break;
        }
        case "☁":
        case "☁️": {//cloudy
            return `
                background: linear-gradient(to bottom, #c4c4c4, #d1d1d1, #dedede, #ebebeb, #f8f8f8);
                color: #000000;
            `;
            break;
        }
        case "": {
            return `
                background: linear-gradient(to bottom, #1c2331, #212a38, #263141, #2b3749, #303d51);
                color: #ffffff;
            `;
            break;
        }
        case "": {//fog
            return `
                background: linear-gradient(to bottom, #d8d8d8, #e2e2e2, #ececec, #f6f6f6, #ffffff);
                color: #000000;
            `;
            break;
        }
        case "": {
            return `
                background: linear-gradient(to bottom, #1c2331, #1c2331, #1c2331, #293547, #38475f);
                color: #ffffff;
            `;
            break;
        }
        case "⛈️": {//heavy rain
            return `
                background: linear-gradient(to bottom, #2c3e50, #34495e, #2c3e50, #34495e, #2c3e50);
                color: #000000;
            `;
            break;
        }
        case "󰙾": {
            return `
                background: linear-gradient(to bottom, #050818, #070b1d, #0a0e22, #0d1126, #10152b);
                color: #ffffff;
            `;
            break;
        }
        case "🌦️": {//light rain
            return `
                background: linear-gradient(to bottom, #547aad, #6692b8, #78a9c3, #8abfd0, #9cd7dd);
                color: #000000;
            `;
            break;
        }
        case "": {
            return `
                background: linear-gradient(to bottom, #0e1620, #121c2a, #162133, #18273c, #1c2c46);
                color: #ffffff;
            `;
            break;
        }
        case "⛅": {//partly cloudy
            return `
                background: linear-gradient(to bottom, #a8c9f0, #c4dfea, #f0f0cc, #ffd700, #f0f0cc, #c4dfea, #a8c9f0);
                color: #000000;
            `;
            break;
        }
        case "": {
            return `
                background: linear-gradient(to bottom, #040d1c, #081427, #0c1a32, #101f3d, #142348);
                color: #ffffff;
            `;
            break;
        }
        case "🌧️": {//rain showers
            return `
                background: linear-gradient(to bottom, #5e7d99, #6a8ba6, #7698b3, #87a5bf, #97b3cb, #a6c0d8, #b4cedf);
                color: #000000;
            `;
            break;
        }
        case "": {
            return `
                background: linear-gradient(to bottom, #050818, #070b1d, #0a0e22, #0d1126, #10152b);
                color: #ffffff;
            `;
            break;
        }
        case "🌨": {//snow
            return `
                background: linear-gradient(to bottom, #d0e6ec, #e0f0f5, #f0f5f9, #f5fafd, #ffffff);
                color: #000000;
            `;
            break;
        }
        case "": {
            return `
                background: linear-gradient(to bottom, #0e1620, #162133, #1c263f, #232c4c, #293259);
                color: #ffffff;
            `;
            break;
        }
        case "🌨️": {//sleet
            return `
                background: linear-gradient(to bottom, #d0e6ec, #e0f0f5, #f0f5f9, #ffffff, #f0f5f9, #e0f0f5, #d0e6ec);
                color: #000000;
            `;
            break;
        }
        case "": {
            return `
                background: linear-gradient(to bottom, #050818, #08142a, #0c1d3b, #101f47, #142556);
                color: #ffffff;
            `;
            break;
        }
        default: {
            return `
                background: red;
                color: blue;
            `;
            break;
        }
    }
}

const WeatherBoxChild = (w: TooltipItem) => (
	<box
		class={"qs-weather-box-child"}
		vertical={true}
		hexpand={true}
	>
        <label label={w.hour + "h"} class={"weather-hour"} />
        <label label={w.icon} class={"weather-icon"} />
        <label label={w.temperature} class={"weather-temperature"} />
        {w.rain != '0 mm' ? <label label={w.rain} class={"weather-rain"} /> : <label />}
        <label label={"  " + Math.round(Number(w.wind.replace(/kph$/, ''))) + ' kph'} class={"weather-wind"} />
	</box>
);

const WeatherBoxChildWrapper = (w: TooltipItem, temperatureDataPerDay: Record<string, TemperatureData>, totalWeatherForecastDataArray: TooltipItem[]) => (
	<box
		class={"qs-weather-box-child-wrapper"}
		hexpand={true}
		$={(self) => {
			let useTotalInstead = false;

			if (totalWeatherForecastDataArray.length) {
				useTotalInstead = true;

				totalWeatherForecastDataArray.forEach(totalEl => {
					self.add(
						WeatherBoxChild(totalEl),
					)
				})
			}

			if (false === useTotalInstead && w && temperatureDataPerDay && temperatureDataPerDay[w.date.substring(0, 3).toUpperCase()].data.length) {
				temperatureDataPerDay[w.date.substring(0, 3).toUpperCase()].data.forEach(el => {
					self.add(
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
		class={"qsweather-widget"}
		vertical={true}
		hexpand={true}
		css={weatherBackgroundStyle(widgetIcon)}
	>
        <box
            class={"qs-weather-box-main"}
        >
            <label label={widgetIcon} class={"weather-icon"} />
            {rain != 0 ? <label label={rain + 'mm'} class={"weather-rain"} /> : <label />}
            <box hexpand={true} />
            <label label={'↑ ' + temperatureDataPerDay[widgetDate.substring(0, 3).toUpperCase()].maxTemp + '  '} class={"weather-max"} />
            <label label={'↓ ' + temperatureDataPerDay[widgetDate.substring(0, 3).toUpperCase()].minTemp + '  '} class={"weather-min"} />
            <label label={widgetDate.substring(0, 3).toUpperCase()} class={"weather-hour"} />
        </box>
        {WeatherBoxChildWrapper(w, temperatureDataPerDay, totalWeatherForecastDataArray)}
	</box>
)

const WeatherInfo = (weatherData: TooltipItem) => (
	<box
		class={"weather-info"}
		vertical={true}
		css={weatherBackgroundStyle(weatherData.icon)}
	>
        <label label={weatherData.date.substring(0, 3).toUpperCase()}/>
        <label label={weatherData.hour + 'h'}/>
        <label />
        <label label={weatherData.icon} class={"weather-icon"}/>
        <label label={weatherData.temperature} class={"weather-temperature"}/>
        {weatherData.rain != '0 mm' ? <label label={weatherData.rain} /> : <label />}
        <label label={'↑ ' + weatherData.maxTemp} class={"weather-max"}/>
        <label label={'↓ ' + weatherData.minTemp} class={"weather-min"}/>
	</box>
);

let prevDayName = "";
let widgetIcon = "";
let widgetDate = "";
let counter = 0;

export const WeatherSchedule = ({ days }: { days: number | null }) => {
    if (!qsShowWeatherSchedule) {
        return (
            <box visible={false} />
        );
    }

    return (
        <box class="weather">
            <For each={weather}>
                {(w: TooltipItem) => {
                    counter++;

                    if (w.indicator) {
                        return <box visible={false} />
                    }

                    // used to limit forecast to specified amount (if total variable is provided, it will display that amount of forecast widgets on a main one)
                    if (days && days >= 0) {
                        if (counter > 99) {
                        	return <box visible={false} />
                        }

                        if (!widgetIcon) {
                            widgetIcon = w.icon;
                        }

                        if (!widgetDate) {
                            widgetDate = w.date;
                        }

                        const rain = temperatureDataPerDay[widgetDate.substring(0, 3).toUpperCase()].rain;
                        counter = 100;

                        return WeatherMainWidget(widgetIcon, widgetDate, rain, temperatureDataPerDay, w, totalWeatherForecastDataArray);
                    }

                    // logic that determines if the widget contains just 1 forecast widget, if so it will display it in a smaller widget - like the one for the forecast days
                    if (temperatureDataPerDay[w.date.substring(0, 3).toUpperCase()].widgetsNumber === 1) {
                        prevDayName = w.date;

                        return (<box>
                            <label label={" "} class={"weather-spacing"}/>
                            {WeatherInfo(w)}
                        </box>);
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

                        prevDayName = w.date;

                        const mainWidget = WeatherMainWidget(widgetIcon, widgetDate, rain, temperatureDataPerDay, w, []);

                        if (counter <= 1) {
                            return mainWidget;
                        }

                        return (<box>
                            <label label={" "} class={"weather-spacing"}/>
                            {mainWidget}
                        </box>);
                    }

                    return <box visible={false} />
                }}
            </For>
        </box>
    )
};
