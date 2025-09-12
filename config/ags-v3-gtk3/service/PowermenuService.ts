import { exec } from "ags/process";
import { timeout } from "ags/time";
import Idle from "./IdleService";
import GObject from "gi://GObject?version=2.0";
import { config } from "../lib/config";
import { PowerMenuAction } from "../lib/types";

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
				lock: [config.powermenu.lockCommand, "Lock"],
				sleep: [config.powermenu.sleepCommand, "Sleep"],
				logout: [config.powermenu.logoutCommand, "Log Out"],
				reboot: [config.powermenu.rebootCommand, "Reboot"],
				shutdown: [config.powermenu.shutdownCommand, "Shutdown"],
			}[action];

			if (action === "lock" || action === "sleep") {
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
