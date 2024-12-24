import { App, Gtk, Astal, Widget } from "astal/gtk3";
import { bind, Variable } from "astal";
import AstalApps from "gi://AstalApps?version=0.1";
import AppItem, { MathResult } from "./AppItem";
import PopupWindow from "../../common/PopupWindow";
import icons from "../../lib/icons";

const apps = new AstalApps.Apps();

const query = Variable<string>("");

function evaluate(expr: string): string {
    // Helper function to handle percentage operations
    const handlePercentage = (expression: string): string => {
        return expression.replace(/(\d+(\.\d+)?)%/g, (match, p1) => {
            return `(${parseFloat(p1) / 100})`;
        });
    };

    // Handle percentage by converting it into a fraction
    expr = handlePercentage(expr);

    // Function to evaluate an expression
    const calculate = (expr: string): number => {
        const tokens = expr.match(/([+\-*/^()])|(\d+(\.\d+)?)/g);
        if (!tokens) throw new Error('Invalid expression');

        const operators: string[] = [];
        const values: number[] = [];

        const precedence: Record<string, number> = {
            '+': 1, '-': 1, '*': 2, '/': 2, '^': 3
        };

        const applyOperator = () => {
            const operator = operators.pop();
            const right = values.pop();
            const left = values.pop();

            if (operator === '+') values.push(left + right);
            else if (operator === '-') values.push(left - right);
            else if (operator === '*') values.push(left * right);
            else if (operator === '/') values.push(left / right);
            else if (operator === '^') values.push(Math.pow(left, right));
        };

        const process = () => {
            while (tokens.length) {
                const token = tokens.shift();
                if (/\d+(\.\d+)?/.test(token)) {
                    values.push(parseFloat(token));
                } else if (token === '(') {
                    operators.push(token);
                } else if (token === ')') {
                    while (operators[operators.length - 1] !== '(') {
                        applyOperator();
                    }
                    operators.pop();
                } else if (precedence[token]) {
                    while (
                        operators.length &&
                        precedence[operators[operators.length - 1]] >= precedence[token]
                    ) {
                        applyOperator();
                    }
                    operators.push(token);
                } else {
                    throw new Error(`Invalid token: ${token}`);
                }
            }

            while (operators.length) {
                applyOperator();
            }

            return values[0];
        };

        return process();
    };

    // Calculate the result
    const result = calculate(expr);

    // Format the result with commas
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
		let mathResult;
		if (containsMathOperation(query)) {
			try {
				// mathResult = eval(query);
				mathResult = evaluate(query.toString());
			} catch (error) {
				// do nothing
			}
		}

		return mathResult ? MathResult(mathResult.toString(), query.toString()) : apps
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
					} else {
						Entry.grab_focus();
					}
				});
			}}
		>
			<box className="app-launcher" vertical>
				<box className="entry-box" >
					<icon
						icon={icons.apps.search}
						className="entry-icon"
						halign={Gtk.Align.CENTER}
						valign={Gtk.Align.CENTER}
					/>
					{Entry}
				</box>
				<scrollable vexpand className={"app-scroll-list"}>
					<box className="app-launcher__list" vertical>
						{items}
					</box>
				</scrollable>
			</box>
		</PopupWindow>
	);
};
