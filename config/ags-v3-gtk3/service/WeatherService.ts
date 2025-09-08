import { createState } from "ags";
import { interval } from "ags/time";
import { execAsync } from "ags/process";
import GLib from "gi://GLib?version=2.0";
import { config } from "../lib/config";

export type TooltipItem = {
      date: string;
      hour: string;
      temperature: string;
      icon: string;
      wind: string;
      rain: string;
      humidity: string;
      minTemp: string;
      maxTemp: string;
      indicator: string;
};

type IconTemperatureData = {
	minTemp: number;
	maxTemp: number;
	rain: number;
	icons: string[];
	widgetsNumber: number;
	data: TooltipItem[];
};

export let temperatureDataPerDay: Record<string, IconTemperatureData> = {};
export let totalWeatherForecastDataArray: TooltipItem[] = [];
export const [updatedAt, setUpdatedAt] = createState("");
export const [weather, setWeather] = createState<TooltipItem[]>([]);

export async function fetchWeather() {
      try {
            const format = "Last updated: %H:%M:%S";
            const time = GLib.DateTime.new_now_local().format(format);
            if (time) {
                  setUpdatedAt(time);
            }
            const out = await execAsync("openweathermap");
            const tooltip = JSON.parse(out);

            if (tooltip) {
                  let prevDayName: string|null = null;
                  temperatureDataPerDay = {};
                  let weatherStatusIconArray: string[] = [];
                  let weatherForecastDataArray: TooltipItem[] = [];
                  totalWeatherForecastDataArray = [];

                  const days = config.weather.days;

                  let totalWeatherForecastsCounter = days;
                  let forecastWidgetsNumber = 0;

                  tooltip.forEach((w: TooltipItem) => {
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
                  setWeather(tooltip)
            }
      } catch (error) {
            console.log(`Weather fetch failed: ${error}`)
      }
}

// repeat every 10 minutes (600000 ms)
interval(600000, () => fetchWeather());
