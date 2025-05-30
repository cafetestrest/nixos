import { execAsync, exec } from "ags/process";
import { dependencies } from "../lib/utils";
import GObject from "gi://GObject"

export enum NightlightMode {
	Off = 0,
	On = 1,
	Auto = 2,
}

const nightlightBinding = {
	0: "Nightlight Off",
	1: "Nightlight On",
	2: "Nightlight Auto",
};

const available = dependencies(["nightlight"]); // ideally it should be wlsunset, but I have it only as runtimeInputs pkgs

export const profileName = (profile: NightlightMode) => {
	return nightlightBinding[profile];
};

class NightlightModeService extends GObject.Object {
	getProfile = () => {
		try {
			return exec(`pidof wlsunset`) ? 2 : 0;
		} catch (error) {
			return 0;
		}
	};

	#profile: NightlightMode = this.getProfile();

	get profile() {
		return this.#profile;
	}

	get profiles(): NightlightMode[] {
		return [0, 1, 2];
	}

	async nextProfile() {
		this.#profile++;
		if (this.#profile > 2) this.#profile = 0;

		if (this.#profile === 2) {
			execAsync("nightlight automatic").catch((err) => {console.error(err)});
		}
		if (this.#profile === 1) {
			execAsync("nightlight enable").catch((err) => {console.error(err)});
		}
		if (this.#profile === 0) {
			execAsync("nightlight disable").catch((err) => {console.error(err)});
		}

		this.notify("profile");
	}
}

const NightlightModeServiceRegister = GObject.registerClass(
	{
		GTypeName: "NightLightService",
		Properties: {
			profile: GObject.ParamSpec.int(
				"profile",
				"Profile",
				"A night-light property",
				GObject.ParamFlags.READWRITE,
				0,
				2,
				0,
			),
		},
		Signals: {},
	},
	NightlightModeService,
);

let service: NightlightModeService | null = null;

if (available) {
	service = new NightlightModeServiceRegister();
}

export default service;
