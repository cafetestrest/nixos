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
      [],
      600_000,
      "bash -c 'openweathermap'",
      (stdout) => {
          return JSON.parse(stdout);
      },
);
