import { Gtk, App } from "astal/gtk3";
import { GLib, monitorFile, exec, Gio, execAsync } from "astal";

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
