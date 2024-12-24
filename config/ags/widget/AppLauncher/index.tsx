import { App, Gtk, Astal, Widget } from "astal/gtk3";
import { bind, Variable } from "astal";
import AstalApps from "gi://AstalApps?version=0.1";
import AppItem, { MathResult } from "./AppItem";
import PopupWindow from "../../common/PopupWindow";
import icons from "../../lib/icons";

const apps = new AstalApps.Apps();

const query = Variable<string>("");

let parens = /\(([0-9+\-*/\^ .]+)\)/             // Regex for identifying parenthetical expressions
let exp = /(\d+(?:\.\d+)?) ?\^ ?(\d+(?:\.\d+)?)/ // Regex for identifying exponentials (x ^ y)
let mul = /(\d+(?:\.\d+)?) ?\* ?(\d+(?:\.\d+)?)/ // Regex for identifying multiplication (x * y)
let div = /(\d+(?:\.\d+)?) ?\/ ?(\d+(?:\.\d+)?)/ // Regex for identifying division (x / y)
let add = /(\d+(?:\.\d+)?) ?\+ ?(\d+(?:\.\d+)?)/ // Regex for identifying addition (x + y)
let sub = /(\d+(?:\.\d+)?) ?- ?(\d+(?:\.\d+)?)/  // Regex for identifying subtraction (x - y)

/**
 * Evaluates a numerical expression as a string and returns a Number
 * Follows standard PEMDAS operation ordering
 * @param {String} expr Numerical expression input
 * @returns {Number} Result of expression
 */
function evaluate(expr: string)
{
    if(isNaN(Number(expr)))
    {
        if(parens.test(expr))
        {
            let newExpr = expr.replace(parens, function(match, subExpr) {
                return evaluate(subExpr);
            });
            return evaluate(newExpr);
        }
        else if(exp.test(expr))
        {
            let newExpr = expr.replace(exp, function(match, base, pow) {
                return Math.pow(Number(base), Number(pow));
            });
            return evaluate(newExpr);
        }
        else if(mul.test(expr))
        {
            let newExpr = expr.replace(mul, function(match, a, b) {
                return Number(a) * Number(b);
            });
            return evaluate(newExpr);
        }
        else if(div.test(expr))
        {
            let newExpr = expr.replace(div, function(match, a, b) {
                if(b != 0)
                    return Number(a) / Number(b);
                else
                    throw new Error('Division by zero');
            });
            return evaluate(newExpr);
        }
        else if(add.test(expr))
        {
            let newExpr = expr.replace(add, function(match, a, b) {
                return Number(a) + Number(b);
            });
            return evaluate(newExpr);
        }
        else if(sub.test(expr))
        {
            let newExpr = expr.replace(sub, function(match, a, b) {
                return Number(a) - Number(b);
            });
            return evaluate(newExpr);
        }
        else
        {
            return expr;
        }
    }
    return Number(expr);
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
