import { Gdk, Gtk, Widget } from "astal/gtk4";
import { getCalendarLayout } from "./Layout";
import { Box, Label, Button } from "astal/gtk4/widget";
import icons from "../../../../lib/icons";

type Day = {
	day: string;
	today: number;
};

let calendarJson = getCalendarLayout(undefined, true);
let monthshift = 0;

const { CENTER, START, END } = Gtk.Align;

function getDateInXMonthsTime(x: number) {
	var currentDate = new Date(); // Get the current date
	var targetMonth = currentDate.getMonth() + x; // Calculate the target month
	var targetYear = currentDate.getFullYear(); // Get the current year

	// Adjust the year and month if necessary
	targetYear += Math.floor(targetMonth / 12);
	targetMonth = ((targetMonth % 12) + 12) % 12;

	// Create a new date object with the target year and month
	var targetDate = new Date(targetYear, targetMonth, 1);

	// Set the day to the last day of the month to get the desired date
	// targetDate.setDate(0);

	return targetDate;
}

const weekDays = [
	// MONDAY IS THE FIRST DAY OF THE WEEK :HESRIGHTYOUKNOW:
	{ day: "Mo", today: 0 },
	{ day: "Tu", today: 0 },
	{ day: "We", today: 0 },
	{ day: "Th", today: 0 },
	{ day: "Fr", today: 0 },
	{ day: "Sa", today: 0 },
	{ day: "Su", today: 0 },
];

const CalendarDay = (day: string, today: number) =>
	Widget.Button({
		cssClasses: ["calendar__button", `${today == 1 ? "calendar__button__today" : today == -1 ? "calendar__button__other-month" : ""}`],
		child: Widget.Box({
			halign: CENTER,
			child: Widget.Label({
				halign: CENTER,
				cssClasses: ["calendar__button_text"],
				label: String(day),
			}),
		})
	});

export default () => {
	const calendarMonthYear = Widget.Button({
		cssClasses: ["calendar__monthyear"],
		onClicked: () => shiftCalendarXMonths(0),
		setup: (button) => {
			button.label = `${new Date().toLocaleString("default", { month: "long" })} ${new Date().getFullYear()}`;
		},
	});

	const addCalendarChildren = (box, calendarJson) => {
		const children = box.get_children();
		for (let i = 0; i < children.length; i++) {
			const child = children[i];
			child.unparent();
		}
		box.children = calendarJson.map(
			(row: Array<Day>) =>
				Widget.Box({
					spacing: 18,
					children: row.map((day) =>
						CalendarDay(day.day, day.today),
					),
				}),
		);
	};

	function shiftCalendarXMonths(x: number) {
		if (x == 0) monthshift = 0;
		else monthshift += x;
		var newDate;
		if (monthshift == 0) newDate = new Date();
		else newDate = getDateInXMonthsTime(monthshift);

		calendarJson = getCalendarLayout(newDate, monthshift == 0);
		calendarMonthYear.label = `${monthshift == 0 ? "" : "• "}${newDate.toLocaleString("default", { month: "long" })} ${newDate.getFullYear()}`;
		addCalendarChildren(calendarDays, calendarJson);
	}

	const calendarHeader = Widget.Box({
		cssClasses: ["calendar__header"],
		spacing: 8,
		children: [
			calendarMonthYear,
			Widget.Box({ hexpand: true }),
			Widget.Box({
				cssClasses: ["spacing-h-5"],
				children: [
					Widget.Button({
						cssClasses: ["sidebar-calendar-monthshift-btn"],
						onClicked: () => shiftCalendarXMonths(-1),
						child: new Gtk.Image({
							iconName: icons.ui.arrow.left,
						}),
					}),
					Widget.Button({
						cssClasses: ["sidebar-calendar-monthshift-btn"],
						onClicked: () => shiftCalendarXMonths(1),
						child: new Gtk.Image({
							iconName: icons.ui.arrow.right,
						}),
					}),
				],
			}),
		]
		// setup: (box) => {
		// 	box.pack_start(calendarMonthYear, false, false, 0);
		// 	box.pack_end(
		// 		Widget.Box({
		// 			cssClasses: ["spacing-h-5"],
		// 			children: [
		// 				Widget.Button({
		// 					cssClasses: ["sidebar-calendar-monthshift-btn"],
		// 					onClicked: () => shiftCalendarXMonths(-1),
		// 					child: new Gtk.Image({
		// 						iconName: icons.ui.arrow.left,
		// 					}),
		// 				}),
		// 				Widget.Button({
		// 					cssClasses: ["sidebar-calendar-monthshift-btn"],
		// 					onClicked: () => shiftCalendarXMonths(1),
		// 					child: new Gtk.Image({
		// 						iconName: icons.ui.arrow.right,
		// 					}),
		// 				}),
		// 			],
		// 		}),
		// 		false,
		// 		false,
		// 		0,
		// 	); //TODOfix check?
		// },
	});

	const calendarDays = Widget.Box({
		cssClasses: ["calendar-days"],
		hexpand: true,
		vertical: true,
		setup: (box) => {
			addCalendarChildren(box, calendarJson);
		},
	});

	return Widget.Box({
		cssClasses: ["calendar", "block"],
		onScroll(self, dx, dy) {
			if (dy > 0) {
				shiftCalendarXMonths(-1)
			} else {
				shiftCalendarXMonths(1)
			}
		},
		// onScroll: (self, event) =>
		// 	shiftCalendarXMonths(
		// 		event.direction === Gdk.ScrollDirection.UP ? 1 : -1,
		// 	),
		setup: (self) => {
			// Connect to the "map" signal to refresh the calendar on visibility
			self.connect("map", () => {
				const newDate = new Date();
				calendarJson = getCalendarLayout(newDate, true); // Recalculate for the current month
				addCalendarChildren(calendarDays, calendarJson);
			});
		},
		child: Widget.Box({
			halign: CENTER,
			children: [
				Widget.Box({
					cssClasses: ["calendar-box-outline"],
					hexpand: true,
					vertical: true,
					children: [
						calendarHeader,
						Widget.Box({
							cssClasses: ["calendar-weekdays"],
							homogeneous: true,
							spacing: 12,
							children: weekDays.map((day: Day, i) =>
								CalendarDay(day.day, day.today),
							),
						}),
						calendarDays,
					],
				}),
			],
		}),
	});
};
