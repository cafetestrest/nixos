import { exec, execAsync, GObject } from "astal";
// import { dependencies } from "../lib/utils";

export enum IdleMode {
	Off = 0,
	On = 1,
}

const idleBinding = {
	0: "off",
	1: "on",
};

// const available = dependencies(["hypridle"]);
const available = true;

export const profileName = (profile: IdleMode) => {
	const profileName = idleBinding[profile];
	return profileName.charAt(0).toUpperCase() + profileName.slice(1);
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

		// if (this.#profile === 1) {
		// 	execAsync("toggleidle toggle").catch((err) => {console.error(err)});
		// }
		// if (this.#profile === 0) {
		// 	execAsync("toggleidle toggle").catch((err) => {console.error(err)});
		// }

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

var service: IdleModeService | null = null;

if (available) {
	service = new IdleModeServiceRegister();
}

export default service;
