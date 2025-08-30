import { Gdk, Gtk, Astal } from "ags/gtk3";
import { getCalendarLayout } from "./Layout";
import icons from "../../../lib/icons";
import { createState } from "ags";

type Day = {
	day: string;
	today: number;
};

let calendarJson: Array<Day>[] = getCalendarLayout(undefined, true);
let monthshift = 0;

const { CENTER } = Gtk.Align;

function getDateInXMonthsTime(x: number) {
	const currentDate = new Date(); // Get the current date
	let targetMonth = currentDate.getMonth() + x; // Calculate the target month
	let targetYear = currentDate.getFullYear(); // Get the current year

	// Adjust the year and month if necessary
	targetYear += Math.floor(targetMonth / 12);
	targetMonth = ((targetMonth % 12) + 12) % 12;

	// Create a new date object with the target year and month
	let targetDate = new Date(targetYear, targetMonth, 1);

	// Set the day to the last day of the month to get the desired date
	// targetDate.setDate(0);

	return targetDate;
}

const weekDays = [
	{ day: "Mo", today: 0 }, // first day of the week
	{ day: "Tu", today: 0 },
	{ day: "We", today: 0 },
	{ day: "Th", today: 0 },
	{ day: "Fr", today: 0 },
	{ day: "Sa", today: 0 },
	{ day: "Su", today: 0 },
];

const CalendarDay = (day: string, today: number) => {
	return (
		<button
			class={`calendar-button ${today == 1 ? "calendar-button-today" : today == -1 ? "calendar-button-other-month" : ""}`}
		>
			<box halign={CENTER}>
				<label
					halign={CENTER}
					class={"calendar-button_text"}
					label={String(day)}
				/>
			</box>
		</button>
	);
};

export default () => {
	const [calendarMonthYearButtonLabel, setCalendarMonthYearButtonLabel] = createState(`${new Date().toLocaleString("default", { month: "long" })} ${new Date().getFullYear()}`);

	const calendarMonthYear =
		<button
			class={"calendar-monthyear"}
			onClicked={() => shiftCalendarXMonths(0)}
			label={calendarMonthYearButtonLabel}
		/>

	const addCalendarChildren = (box: any, calendarJson: any) => {
		const children = box.get_children();
		for (let i = 0; i < children.length; i++) {
			const child = children[i];
			child.destroy();
		}
		box.children = calendarJson.map(
			(row: Array<Day>) => {
				return (
					<box
						spacing={18}
						children={row.map((day) =>
							CalendarDay(day.day, day.today),
						)}
					/>
				);
			}
		);
	};

	function shiftCalendarXMonths(x: number) {
		if (x == 0) monthshift = 0;
		else monthshift += x;
		let newDate;
		if (monthshift == 0) newDate = new Date();
		else newDate = getDateInXMonthsTime(monthshift);

		calendarJson = getCalendarLayout(newDate, monthshift == 0);
		setCalendarMonthYearButtonLabel(`${monthshift == 0 ? "" : "• "}${newDate.toLocaleString("default", { month: "long" })} ${newDate.getFullYear()}`);
		addCalendarChildren(calendarDays, calendarJson);
	}

	const calendarHeader = (
		<box
			class={"calendar-header"}
			spacing={8}
		>
			{calendarMonthYear}
			<box
				class={"spacing-h-5"}
				spacing={10}
			>
				<box hexpand/>
				<button
					class={"sidebar-calendar-monthshift-btn"}
					onClicked={() => shiftCalendarXMonths(-1)}
				>
					<icon icon={icons.ui.arrow.left}/>
				</button>
				<button
					class={"sidebar-calendar-monthshift-btn"}
					onClicked={() => shiftCalendarXMonths(1)}
				>
					<icon icon={icons.ui.arrow.right}/>
				</button>
			</box>
		</box>
	)

	const calendarDays = (
		<box
			class={"calendar-days"}
			hexpand={true}
			vertical={true}
			$={(box) => {
				addCalendarChildren(box, calendarJson);
			}}
		/>
	);

	return (
		<eventbox
			class={"calendar block"}
			onScroll={(_, event: Astal.ScrollEvent) => {
				shiftCalendarXMonths(
					event.direction === Gdk.ScrollDirection.UP ? 1 : -1,
				)
			}}
			$={(self) => {
				// Connect to the "map" signal to refresh the calendar on visibility
				self.connect("map", () => {
					const newDate = new Date();
					calendarJson = getCalendarLayout(newDate, true); // Recalculate for the current month
					addCalendarChildren(calendarDays, calendarJson);
					shiftCalendarXMonths(0);
				});
			}}
		>
			<box
				halign={CENTER}
			>
				<box
					class={"calendar-box-outline"}
					hexpand={true}
					vertical={true}
				>
					{calendarHeader}
					<box
						class={"calendar-weekdays"}
						homogeneous={true}
						spacing={12}
						children={weekDays.map((day: Day, i) =>
							CalendarDay(day.day, day.today),
						)}
					/>
					{calendarDays}
				</box>
			</box>
		</eventbox>
	);
};
