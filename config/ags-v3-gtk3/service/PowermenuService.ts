import { exec } from "ags/process";
import { timeout } from "ags/time";
import Idle from "./IdleService";
import GObject from "gi://GObject?version=2.0";

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

			if (action === "lock") {
				const current = Idle?.currentProfile();
				if (current === 0) {
					Idle?.nextProfile();
					timeout(1500, () => {
						// do nothing, Idle needs to wait small delay for nextProfile to run
					});
				}
			}

			this.notify("cmd");
			this.notify("title");
			exec(this.#cmd);
		}
	},
);

const service = new PowerMenuSerivce();
export default service;
