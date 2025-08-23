import { createPoll } from "ags/time";

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

export const weather = createPoll(
      null,
	600_000,
	"openweathermap",
	(out, _) => {
		return JSON.parse(out);
	},
);
