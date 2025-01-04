import { App, Gtk, Astal, Widget } from "astal/gtk3";
import { bind, Variable } from "astal";
import AstalApps from "gi://AstalApps?version=0.1";
import AppItem, { MathResult } from "./AppItem";
import PopupWindow from "../../common/PopupWindow";
import icons from "../../lib/icons";
import Calendar from "../Dashboard/items/Calendar";
import Media from "../ControlCenter/items/Media";
import Todos from "../Dashboard/items/Todos";
import { Tooltip } from "../Dashboard/weather";
import { PowermenuButtons } from "../Powermenu";
// import { Sinks } from "../Popups/menus/Sink";
import { MixerMenu } from "../Popups/menus/Mixer";
import Volume, { SinkRevealer, revealSinks } from "../ControlCenter/items/Volume";
import { AllNotifications } from "../Notifications";

const apps = new AstalApps.Apps();

const query = Variable<string>("");
const widget = Variable<string>("");
const showWidgetCalendar = Variable<boolean>(false);
const showWidgetSinks = Variable<boolean>(false);
const showWidgetPowermenu = Variable<boolean>(false);
const showWidgetWeather = Variable<boolean>(false);
const showWidgetMedia = Variable<boolean>(false);
export const widgetNotificationsQuery = Variable<string>('');
export const widgetTodoQuery = Variable<string>('');

function evaluate(expr: string): string {
    const operators: { [key: string]: (a: number, b: number) => number } = {
        '+': (a, b) => a + b,
        '-': (a, b) => a - b,
        '*': (a, b) => a * b,
        '/': (a, b) => a / b,
        '^': (a, b) => Math.pow(a, b)
    };

    const precedence: { [key: string]: number } = {
        '+': 1,
        '-': 1,
        '*': 2,
        '/': 2,
        '^': 3
    };

    const toPostfix = (infix: string): string[] => {
        const output: string[] = [];
        const stack: string[] = [];
        const tokens = infix.match(/(\d+(\.\d+)?|\+|\-|\*|\/|\^|\(|\))/g);

        if (!tokens) throw new Error("Invalid expression");

        for (const token of tokens) {
            if (!isNaN(parseFloat(token))) {
                output.push(token);
            } else if (token === '(') {
                stack.push(token);
            } else if (token === ')') {
                while (stack.length && stack[stack.length - 1] !== '(') {
                    output.push(stack.pop()!);
                }
                stack.pop();
            } else if (token in operators) {
                while (
                    stack.length &&
                    precedence[stack[stack.length - 1]] >= precedence[token] &&
                    token !== '^'
                ) {
                    output.push(stack.pop()!);
                }
                stack.push(token);
            }
        }

        while (stack.length) {
            output.push(stack.pop()!);
        }

        return output;
    };

    const evaluatePostfix = (postfix: string[]): number => {
        const stack: number[] = [];

        for (const token of postfix) {
            if (!isNaN(parseFloat(token))) {
                stack.push(parseFloat(token));
            } else if (token in operators) {
                const b = stack.pop();
                const a = stack.pop();
                if (a === undefined || b === undefined) throw new Error("Invalid expression");
                stack.push(operators[token](a, b));
            }
        }

        if (stack.length !== 1) throw new Error("Invalid expression");
        return stack[0];
    };

    const result = evaluatePostfix(toPostfix(expr));
	return formatWithCommas(result);
}


// Helper function to format numbers with commas
function formatWithCommas(num: number): string {
    if (isNaN(num)) return 'Invalid number';

    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function containsMathOperation(text:string) {
	// Define a regular expression to match mathematical operators
	const mathOperationRegex = /[+\-*/]/;

	// Use the test method to check if the text contains a math operation
	return mathOperationRegex.test(text);
}

export default () => {
	const items = query((query) => {
		if (query.startsWith(":")) {
			widget.set(query)
		} else {
			widget.set('')
		}

		let mathResult;
		if (containsMathOperation(query)) {
			try {
				// mathResult = eval(query);
				mathResult = evaluate(query.toString());
			} catch (error) {
				// do nothing
			}
		}

		return mathResult ? MathResult(mathResult.toString()) : apps
			.fuzzy_query(query)
			.map((app: AstalApps.Application) => AppItem(app))
	});

	const Entry = new Widget.Entry({
		hexpand: true,
		text: bind(query),
		canFocus: true,
		className: "app-launcher__input",
		onActivate: () => {
			items.get()[0]?.app.launch();
			App.toggle_window("app-launcher");
		},
		setup: (self) => {
			self.hook(self, "notify::text", () => {
				query.set(self.get_text());
			});
		},
	});

	return (
		<PopupWindow
			scrimType="transparent"
			visible={false}
			margin={12}
			vexpand={true}
			name="app-launcher"
			namespace="app-launcher"
			className="AppLauncher"
			keymode={Astal.Keymode.EXCLUSIVE}
			exclusivity={Astal.Exclusivity.NORMAL}
			layer={Astal.Layer.OVERLAY}
			application={App}
			onKeyPressEvent={(self, event) => {
				const [keyEvent, keyCode] = event.get_keycode();
				if (keyEvent && keyCode == 9) {
					App.toggle_window(self.name);
				}
			}}
			setup={(self) => {
				self.hook(self, "notify::visible", () => {
					if (!self.get_visible()) {
						query.set("");
						revealSinks.set(false);
					} else {
						Entry.grab_focus();
					}
				});
			}}
		>
			<box className="app-launcher" vertical
				css={bind(items).as((i) => {
					const queryText = widget.get();
					if (queryText === '') {
						showWidgetPowermenu.set(false);
						showWidgetMedia.set(false);
						showWidgetWeather.set(false);
						showWidgetCalendar.set(false);
						showWidgetSinks.set(false);
						widgetTodoQuery.set('');
						widgetNotificationsQuery.set('');
					}

					if (queryText !== '' && queryText.startsWith(":")) {
						if (queryText.startsWith(":p")) {
							showWidgetPowermenu.set(true);
							return "min-height: 11rem;";
						}

						if (queryText.startsWith(":m")) {
							showWidgetMedia.set(true);
							return "min-height: 15rem;";
						}

						if (queryText.startsWith(":w")) {
							showWidgetWeather.set(true);
							return "min-height: 17rem;";
						}

						if (queryText.startsWith(":cal")) {
							showWidgetCalendar.set(true);
							return "min-height: 27.5rem;";
						}

						if (queryText.startsWith(":s")) {
							showWidgetSinks.set(true);
							return "min-height: 27.5rem;";
						}

						if (queryText.startsWith(":todo")) {
							widgetTodoQuery.set(queryText);
							return "min-height: 27.5rem;";
						}

						if (queryText.startsWith(":n")) {
							widgetNotificationsQuery.set(queryText);
							return "min-height: 27.5rem;";
						}

						return "min-height: 27.5rem;";
					}

					if (containsMathOperation(query.get()))
						return "min-height: 4rem;";

					if (!i || !Array.isArray(i))
						return "";

					const length = i.length;
					if (length === 0)
						return "min-height: 0;";

					if (length > 7)
						return "min-height: 27.5rem;";

					// Calculate proportional height if length <= 7
					const baseHeight = 7; // Minimum number of items for the max height
					const maxMinHeight = 27.5; // Maximum min-height in rem
					const minMinHeight = 3; // Minimum min-height in rem (adjust as needed)

					// Calculate proportional min-height
					const heightPerItem = (maxMinHeight - minMinHeight) / baseHeight;
					const calculatedHeight = minMinHeight + length * heightPerItem;
					return `min-height: ${calculatedHeight.toFixed(2)}rem;`;
				})}
				>
				<box className="entry-box" >
					<icon
						icon={icons.apps.search}
						className="entry-icon"
						halign={Gtk.Align.CENTER}
						valign={Gtk.Align.CENTER}
					/>
					{Entry}
				</box>
				<revealer
					transitionType={Gtk.RevealerTransitionType.SLIDE_UP}
					revealChild={bind(items).as((i) => {
						if (widget.get() !== '')
							return true;

						if (containsMathOperation(query.get()))
							return true;

						if (!i || !Array.isArray(i))
							return false;

						if (i.length === 0)
							return false;
						return true;
					})}
				>
				<scrollable vexpand className={"app-scroll-list"}>
					<box className="app-launcher__list" vertical>
						<box vertical visible={bind(widget).as((w) => w === '' ? true : false)}>
							{items}
						</box>
						{bind(showWidgetSinks).as((w) => {
							if (w)
								revealSinks.set(true);

							return w ?
							(
								<box className={"app-launcher-sinks"} vertical>
									<box className={"qsvolume-box"}>
										<Volume valign={Gtk.Align.CENTER}/>
									</box>
									<MixerMenu />
									<SinkRevealer />
								</box>
							) : ( <box />)
						})}
						{bind(showWidgetPowermenu).as((w) => {
							return w ?
							(
								<box className={"app-launcher-powermenu"}>
									<PowermenuButtons />
								</box>
							) : ( <box />)
						})}
						<box className={"app-launcher-weather"} visible={bind(showWidgetWeather)}>
							<Tooltip total={7} />
						</box>
						{bind(showWidgetCalendar).as((w) => {
							return w ?
							(
								<box className={"app-launcher-calendar"}>
									{Calendar()}
								</box>
							) : ( <box />)
						})}
						{bind(widgetTodoQuery).as((w) => {
							return w !== "" ?
							(
								<box className={"app-launcher-todo"}>
									{Todos()}
								</box>
							) : ( <box />)
						})}
						{bind(showWidgetMedia).as((w) => {
							return w ?
							(
								<box className={"app-launcher-media"}>
									<Media />
								</box>
							) : ( <box />)
						})}
						<box className={"app-launcher-notifications"} visible={bind(widgetNotificationsQuery).as((w) => w !== "")}>
							<AllNotifications />
						</box>
					</box>
				</scrollable>
				</revealer>
			</box>
		</PopupWindow>
	);
};
