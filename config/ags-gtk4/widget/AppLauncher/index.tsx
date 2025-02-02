import { App, Gtk, Gdk, Astal, Widget, hook } from "astal/gtk4";
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
import { MixerMenu } from "../Popups/menus/Mixer";
import Volume, { SinkRevealer, revealSinks } from "../ControlCenter/items/Volume";
import { AllNotifications } from "../Notifications";
import { FirstPage, SecondPage } from "../ControlCenter/pages/Main";

const apps = new AstalApps.Apps();
export const namespace = "app-launcher";

const query = Variable<string>("");
const widget = Variable<string>("");
const showWidgetCalendar = Variable<boolean>(false);
const showWidgetSinks = Variable<boolean>(false);
const showWidgetPowermenu = Variable<boolean>(false);
const showWidgetWeather = Variable<boolean>(false);
const showWidgetMedia = Variable<boolean>(false);
export const widgetNotificationsQuery = Variable<string>('');
export const widgetTodoQuery = Variable<string>('');
export const showWidgetControlCenter = Variable<boolean>(false);

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
				mathResult = evaluate(query.toString());
			} catch (error) {
				// do nothing
			}
		}

		return mathResult ? MathResult(mathResult.toString()) : apps
			.fuzzy_query(query)
			.map((app: AstalApps.Application) => AppItem(app))
	});

	const Entry = Widget.Entry({
		hexpand: true,
		// text: bind(query), //TODOfix check if needed?
		canFocus: true,
		cssClasses: ["app-launcher__input"],
		onActivate: () => {
			items.get()[0]?.app.launch();
			App.toggle_window(namespace);
		},
		setup: (self: Gtk.Entry) => {
			hook(self, self, "notify::text", () => {
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
			name={namespace}
			namespace={namespace}
			className="AppLauncher"
			keymode={Astal.Keymode.EXCLUSIVE}
			exclusivity={Astal.Exclusivity.NORMAL}
			layer={Astal.Layer.OVERLAY}
			application={App}
			onKeyPressed={(_, keyval) => {
				if (keyval === Gdk.KEY_Escape) {
					App.toggle_window(namespace);
				}
			}}
			setup={(self) => {
				hook(self, self, "notify::visible", () => {
					if (!self.get_visible()) {
						query.set("");
						revealSinks.set(false);
					} else {
						Entry.grab_focus();
					}
				});
			}}
		>
			<box
				vertical
				cssClasses={bind(items).as((i) => {
					const queryText = widget.get();
					if (queryText === '') {
						showWidgetPowermenu.set(false);
						showWidgetMedia.set(false);
						showWidgetWeather.set(false);
						showWidgetCalendar.set(false);
						showWidgetSinks.set(false);
						widgetTodoQuery.set('');
						widgetNotificationsQuery.set('');
						showWidgetControlCenter.set(false);
					}

					if (queryText !== '' && queryText.startsWith(":")) {
						if (queryText.startsWith(":p")) {
							showWidgetPowermenu.set(true);
							return [`${namespace}`, `${namespace}-11`];
						}

						if (queryText.startsWith(":m")) {
							showWidgetMedia.set(true);
							return [`${namespace}`, `${namespace}-15`];
						}

						if (queryText.startsWith(":w")) {
							showWidgetWeather.set(true);
							return [`${namespace}`, `${namespace}-17`];
						}

						if (queryText.startsWith(":cal")) {
							showWidgetCalendar.set(true);
							return [`${namespace}`, `${namespace}-27-5`];
						}

						if (queryText.startsWith(":s")) {
							showWidgetSinks.set(true);
							return [`${namespace}`, `${namespace}-27-5`];
						}

						if (queryText.startsWith(":todo")) {
							widgetTodoQuery.set(queryText);
							return [`${namespace}`, `${namespace}-27-5`];
						}

						if (queryText.startsWith(":qs") || queryText.startsWith(":cc")) {
							showWidgetControlCenter.set(true);
							return [`${namespace}`, `${namespace}-27-5`];
						}

						if (queryText.startsWith(":n")) {
							widgetNotificationsQuery.set(queryText);
							return [`${namespace}`, `${namespace}-27-5`];
						}

						return [`${namespace}`, `${namespace}-27-5`];
					}

					if (containsMathOperation(query.get()))
						return [`${namespace}`, `${namespace}-4`];

					if (!i || !Array.isArray(i))
						return [`${namespace}`, `${namespace}-0`];

					const length = i.length;

					if (length === 0)
						return [`${namespace}`, `${namespace}-0`];

					if (length > 7)
						return [`${namespace}`, `${namespace}-27-5`];

					// Calculate proportional height if length <= 7
					const baseHeight = 7; // Minimum number of items for the max height
					const maxMinHeight = 27.5; // Maximum min-height in rem
					const minMinHeight = 3; // Minimum min-height in rem (adjust as needed)

					// Calculate proportional min-height
					const heightPerItem = (maxMinHeight - minMinHeight) / baseHeight;
					const calculatedHeight = minMinHeight + length * heightPerItem;

					const css = calculatedHeight.toFixed(1).replace(".0", "").replace(".", "-");

					return [`${namespace}`, `${namespace}-${css}`];
				})}
				>
				<box cssClasses={["entry-box"]} >
					<image
						iconName={icons.apps.search}
						cssClasses={["entry-icon"]}
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
				<Gtk.ScrolledWindow vexpand cssClasses={["app-scroll-list"]}>
					<box cssClasses={["app-launcher__list"]} vertical>
						<box vertical visible={bind(widget).as((w) => w === '' ? true : false)}>
							{items}
						</box>
						<box cssClasses={["app-launcher-sinks"]} vertical visible={bind(showWidgetSinks).as((w) => {
							if (w)
								revealSinks.set(true);
							return w;
							})}
						>
							<box cssClasses={["qsvolume-box"]}>
								<Volume valign={Gtk.Align.CENTER}/>
							</box>
							<MixerMenu />
							<SinkRevealer />
						</box>

						<box cssClasses={["app-launcher-powermenu"]} visible={bind(showWidgetPowermenu)}>
							<PowermenuButtons />
						</box>

						<box cssClasses={["app-launcher-weather"]} visible={bind(showWidgetWeather)}>
							<Tooltip total={7} />
						</box>

						<box cssClasses={["app-launcher-calendar"]} visible={bind(showWidgetCalendar)}>
							{Calendar()}
						</box>

						<box cssClasses={["app-launcher-todo"]} visible={bind(widgetTodoQuery).as((w) => w !== "")}>
							{Todos()}
						</box>

						<box vertical cssClasses={["app-launcher-controlcenter"]} visible={bind(showWidgetControlCenter)}>
							<FirstPage />
							<box cssClasses={["control-center-box-space"]} />
							<SecondPage />
						</box>

						<box cssClasses={["app-launcher-media"]} visible={bind(showWidgetMedia)}>
							<Media />
						</box>

						<box cssClasses={["app-launcher-notifications"]} visible={bind(widgetNotificationsQuery).as((w) => w !== "")}>
							<AllNotifications />
						</box>
					</box>
				</Gtk.ScrolledWindow>
				</revealer>
			</box>
		</PopupWindow>
	);
};
