import { GObject, exec } from "astal";
import { toggleWindow } from "../lib/utils";

export type PowerMenuAction = "lock" | "sleep" | "logout" | "reboot" | "shutdown";

const PowerMenuSerivce = GObject.registerClass(
	{
		Properties: {
			title: GObject.ParamSpec.string(
				"title",
				"Title",
				"A property containing powermenu action title",
				GObject.ParamFlags.READABLE,
				"",
			),
			cmd: GObject.ParamSpec.string(
				"cmd",
				"CMD",
				"A property containing command to be executed",
				GObject.ParamFlags.READABLE,
				"",
			),
		},
	},
	class PowerMenu extends GObject.Object {
		#title = "";
		#cmd = "";

		get title() {
			return this.#title;
		}
		get cmd() {
			return this.#cmd;
		}

		action(action: PowerMenuAction) {
			[this.#cmd, this.#title] = {
				lock: ["idle l", "Lock"],
				sleep: ["idle s", "Sleep"],
				logout: ["hyprctl dispatch exit", "Log Out"],
				reboot: ["systemctl reboot", "Reboot"],
				shutdown: ["shutdown now", "Shutdown"],
			}[action];

			this.notify("cmd");
			this.notify("title");
			toggleWindow("powermenu");
			// toggleWindow("verification");
			exec(this.#cmd);
		}
	},
);

const service = new PowerMenuSerivce();
export default service;
