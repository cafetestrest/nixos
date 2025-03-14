import { App } from "astal/gtk3";
import { GLib, monitorFile, exec, Gio, execAsync, readFileAsync, writeFileAsync } from "astal";

type ThemeMode = "dark" | "light";

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
		App.apply_css(targetPath);
	});
}

export const gsettings = new Gio.Settings({
	schema: "org.gnome.desktop.interface",
});

const tmp = GLib.get_tmp_dir();
const pathSuffix = "/ags/style/";

export async function toggleColorMode() {
	const mode = gsettings.get_string("color-scheme") == "prefer-light" ? "light" : "dark" as ThemeMode;;

	let reloadScss = false;
	const styleDir = `${SRC}/style/`;

	await bash(`mkdir -p ${tmp}${pathSuffix}`);

	const styleFiles = await bash(`find ${styleDir} -name "*.scss"`);
	const files = styleFiles.split(/\s+/)

	for (const file of files) {
		const fileName = file.split(pathSuffix)[1];
		const targetDir = `${tmp}${pathSuffix}${fileName}`;

		let styleContent;
		if (fileName === "variables.scss") {
			const variablesFileName = mode === "dark" ? "variables-light.scss" : "variables-dark.scss";
			styleContent = `@forward "./${variablesFileName}";`;
			reloadScss = true;
		} else {
			styleContent = await readFileAsync(file).catch(console.error);
		}

		if (styleContent) {
			await writeFileAsync(targetDir, styleContent).catch(console.error);
		}
	}

	if (reloadScss) {
		const preferMode = mode === "dark" ? "light" : "dark";
		gsettings.set_string("color-scheme", `prefer-${preferMode}`);

		await applyColorMode(false);
	}
}

export async function applyColorMode(checkTmpFiles: boolean) {
	const css = `${GLib.get_tmp_dir()}/styles.css`;
	const scss = `${tmp}${pathSuffix}main.scss`;

	if (checkTmpFiles) {
		const tmpCssFileContent = await readFileAsync(css).catch(console.error);
		const tmpMainFileContent = await readFileAsync(scss).catch(console.error);

		if (tmpCssFileContent === undefined) {
			console.log(`Can't apply color mode, there is no css file under: ${tmpCssFileContent}`)
			return;
		}

		if (tmpMainFileContent === undefined) {
			console.log(`Can't apply color mode, there is no scss file under: ${tmpMainFileContent}`)
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
