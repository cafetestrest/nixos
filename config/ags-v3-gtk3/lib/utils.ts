import App from "ags/gtk3/app";
import GLib from "gi://GLib?version=2.0";
import { monitorFile, readFileAsync, writeFileAsync } from "ags/file";
import Gio from "gi://Gio?version=2.0";
import { exec, execAsync } from "ags/process";
import { Astal } from "ags/gtk3";
import { config } from "./config";

const DARK = "dark";
const LIGHT = "light";
export type ThemeMode = typeof DARK | typeof LIGHT;

const tmp = GLib.get_tmp_dir();
const pathSuffix = "/style/";
const scss = `${tmp}/ags${pathSuffix}main.scss`;
const variablesFileName = "variables.scss";

export function getThemeColor(themeMode?: ThemeMode) {
	let color = themeMode;
	if (themeMode === undefined) {
		const mode = gsettings.get_string("color-scheme") == `prefer-${LIGHT}` ? LIGHT : DARK as ThemeMode;
		color = mode ?? DARK;
	}

	return color;
}

export async function ensureTmpScssFilesExist() {
	const styleDir = `${SRC}/style/`;
	const styleFiles = await bash(`find ${styleDir} -name "*.scss"`);
	const files = styleFiles.split(/\s+/);

	for (const file of files) {
		const fileName = file.split(pathSuffix)[1];
		const targetDir = `${tmp}/ags${pathSuffix}${fileName}`;
		const styleContent = await readFileAsync(file).catch(console.error);

		if (styleContent) {
			await writeFileAsync(targetDir, styleContent).catch(console.error);
		}
	}
}

export async function syncVariablesToTmp(scssColorVariables: string[]) {
	ensureDirectory(`${tmp}/ags${pathSuffix}`);
	const targetDir = `${tmp}/ags${pathSuffix}${variablesFileName}`;

	await ensureTmpScssFilesExist();

	await writeFileAsync(targetDir, scssColorVariables.join("\n")).catch(console.error);
	await applyColorMode(false);
}

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
	return Array.from({ length: max }, (_, i) => i + 1);
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

export async function toggleColorScheme(themeMode?: ThemeMode) {
	let preferMode = themeMode;
	if (themeMode === undefined) {
		const mode = gsettings.get_string("color-scheme") == `prefer-${LIGHT}` ? LIGHT : DARK as ThemeMode;
		preferMode = mode === DARK ? LIGHT : DARK;
	}

	gsettings.set_string("color-scheme", `prefer-${preferMode}`);
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

export function fileExists(path: string) {
    return GLib.file_test(path, GLib.FileTest.EXISTS);
}

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

export function isIcon(icon?: string | null) {
	return icon && !!Astal.Icon.lookup_icon(icon);
}

export function getClassIcon(clientClass: string, fallbackIcon: string = "application-x-executable") {
	const classIcon = config.substitutions.icons[clientClass];
	return classIcon ? classIcon : isIcon(clientClass)
		? clientClass
		: fallbackIcon;
}
