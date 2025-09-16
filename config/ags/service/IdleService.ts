import GObject from "gi://GObject?version=2.0";
import { exec, execAsync } from "ags/process";
import { dependencies } from "../lib/utils";

export enum IdleMode {
	Off = 0,
	On = 1,
}

const idleBinding = {
	0: "Idle Off",
	1: "Idle On",
};

const available = dependencies(["toggleidle"]); // ideally it should be hypridle, but I have it only as runtimeInputs pkgs

export const profileName = (profile: IdleMode) => {
	return idleBinding[profile];
};

class IdleModeService extends GObject.Object {
	getProfile = () => {
		try {
			return exec(`pidof hypridle`) ? 1 : 0;
		} catch (error) {
			return 0;
		}
	};

	#profile: IdleMode = this.getProfile();

	get profile() {
		return this.#profile;
	}

	get profiles(): IdleMode[] {
		return [0, 1];
	}

	currentProfile = () => {
		return this.#profile;
	}

	async nextProfile() {
		this.#profile++;
		if (this.#profile > 1) this.#profile = 0;

		execAsync("toggleidle toggle").catch((err) => {console.error(err)});

		this.notify("profile");
	}
}

const IdleModeServiceRegister = GObject.registerClass(
	{
		GTypeName: "IdleService",
		Properties: {
			profile: GObject.ParamSpec.int(
				"profile",
				"Profile",
				"An idle property",
				GObject.ParamFlags.READWRITE,
				0,
				1,
				0,
			),
		},
		Signals: {},
	},
	IdleModeService,
);

let service: IdleModeService | null = null;

if (available) {
	service = new IdleModeServiceRegister();
}

export default service;
