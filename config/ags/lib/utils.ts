import { App } from "astal/gtk3";
import { GLib, monitorFile, exec, Gio, execAsync, readFileAsync, writeFileAsync } from "astal";

const DARK = "dark";
const LIGHT = "light";
type ThemeMode = typeof DARK | typeof LIGHT;

const tmp = GLib.get_tmp_dir();
const pathSuffix = "/ags/style/";
const colorsPathSuffix = "colors";
const scss = `${tmp}${pathSuffix}main.scss`;

export function dependencies(packages: string[]) {
	for (const pkg of packages) {
		const result = GLib.find_program_in_path(pkg);
		if (!result) {
			return false;
		}
	}
	return true;
}

export function range(max: number) {
	return Array.from({ length: max + 1 }, (_, i) => i);
}

export function reloadScss(monitorFilePath: string, targetPath: string, execSassPath: string) {
	monitorFile(`${SRC}/${monitorFilePath}`, () => {
		exec(`sass ${SRC}/${execSassPath} ${targetPath}`);
        App.reset_css(); // Have to reset the whole CSS before applying new one
		App.apply_css(targetPath);
	});
}

export const gsettings = new Gio.Settings({
	schema: "org.gnome.desktop.interface",
});

export async function applyStyles() {
	const variablesFileName = "variables.scss";
	const tmpVariablesFile = `${tmp}${pathSuffix}${variablesFileName}`;

	if (!fileExists(tmpVariablesFile)) {
		toggleColorMode(false);
	}
}

export async function toggleColorMode(toggle: boolean) {
	const mode = gsettings.get_string("color-scheme") == `prefer-${LIGHT}` ? LIGHT : DARK as ThemeMode;

	let reloadScss = false;
	let reloadColorMode = false;
	let useOverrideVariables = false;
	const styleDir = `${SRC}/style/`;

	ensureDirectory(`${tmp}${pathSuffix}${colorsPathSuffix}`);

	const styleFiles = await bash(`find ${styleDir} -name "*.scss"`);
	const files = styleFiles.split(/\s+/)
	const preferMode = mode === DARK ? LIGHT : DARK;
	const variablesFileName = "variables.scss";

	const config = GLib.get_user_config_dir();
	const variablesOverrideFile = `${config}/.ags-override/${variablesFileName}`;

	if (fileExists(variablesOverrideFile)) {
		useOverrideVariables = true;
	}

	for (const file of files) {
		const fileName = file.split(pathSuffix)[1];
		const targetDir = `${tmp}${pathSuffix}${fileName}`;

		let styleContent = await readFileAsync(file).catch(console.error);

		if (fileName === variablesFileName && useOverrideVariables) {
			styleContent = await readFileAsync(variablesOverrideFile).catch(console.error);
		}

		if (styleContent) {
			if (toggle && fileName === variablesFileName) {
				styleContent = styleContent.replace(new RegExp(`/${colorsPathSuffix}/${mode}\\.scss`, "g"), `/${colorsPathSuffix}/${preferMode}.scss`);
				reloadColorMode = true;
			}

			reloadScss = true;
			await writeFileAsync(targetDir, styleContent).catch(console.error);
		}
	}

	if (toggle && reloadColorMode) {
		gsettings.set_string("color-scheme", `prefer-${preferMode}`);
	}

	if (reloadScss) {
		await applyColorMode(false);
	}
}

export async function applyColorMode(checkTmpFiles: boolean) {
	const css = `${GLib.get_tmp_dir()}/styles.css`;

	if (checkTmpFiles) {
		if (fileExists(css) !== true) {
			console.log(`Can't apply color mode, there is no css file under: ${css}`);
			console.log("If this is first time you are running ags, please ignore this message.");
			return;
		}

		if (fileExists(scss) !== true) {
			console.log(`Can't apply color mode, there is no scss file under: ${scss}`);
			return;
		}
	}

	await bash(`sass ${scss} ${css}`);
	App.apply_css(css, true);
}

export function ensureDirectory(path: string) {
	if (!GLib.file_test(path, GLib.FileTest.EXISTS))
		Gio.File.new_for_path(path).make_directory_with_parents(null);
}

export const fileExists = (path: string) =>
    GLib.file_test(path, GLib.FileTest.EXISTS);

export async function bash(
	strings: TemplateStringsArray | string,
	...values: unknown[]
) {
	const cmd =
		typeof strings === "string"
			? strings
			: strings.flatMap((str, i) => str + `${values[i] ?? ""}`).join("");

	return execAsync(["bash", "-c", cmd]).catch((err) => {
		console.error(cmd, err);
		return "";
	});
}
