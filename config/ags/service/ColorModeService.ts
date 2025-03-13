import { GObject } from "astal";
import { gsettings, toggleColorMode } from "../lib/utils";

export enum ColorMode {
	Light = 0,
	Dark = 1,
}

const colorBinding = {
	0: "light",
	1: "dark",
};

const available = true;

export const profileName = (profile: ColorMode) => {
	const profileName = colorBinding[profile];
	return profileName.charAt(0).toUpperCase() + profileName.slice(1);
};

class ColorModeService extends GObject.Object {
	getProfile = () => {
		try {
			const mode = gsettings.get_string("color-scheme") == "prefer-light" ? "light" : "dark";
			return mode === "dark" ? 1 : 0;
		} catch (error) {
			return 1; // dark by default
		}
	};

	#profile: ColorMode = this.getProfile();

	get profile() {
		return this.#profile;
	}

	get profiles(): ColorMode[] {
		return [0, 1];
	}

	currentProfile = () => {
		return this.#profile;
	}

	async nextProfile() {
		this.#profile++;
		if (this.#profile > 1) this.#profile = 0;

		toggleColorMode();

		this.notify("profile");
	}
}

const ColorModeServiceRegister = GObject.registerClass(
	{
		GTypeName: "ColorService",
		Properties: {
			profile: GObject.ParamSpec.int(
				"profile",
				"Profile",
				"An color property",
				GObject.ParamFlags.READWRITE,
				0,
				1,
				0,
			),
		},
		Signals: {},
	},
	ColorModeService,
);

var service: ColorModeService | null = null;

if (available) {
	service = new ColorModeServiceRegister();
}

export default service;
