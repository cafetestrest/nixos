import { Variable } from "astal";

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

export const weather = Variable<Array<TooltipItem> | null>(null).poll(
	600_000,
	"openweathermap",
	(out, prev) => {
		return JSON.parse(out);
	},
);
