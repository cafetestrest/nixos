import { App, Gtk, Gdk } from "astal/gtk4";
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

/**
 * Looks up an icon by name and size.
 *
 * This function retrieves an icon from the default icon theme based on the
 * provided name, scale, and size. If the name is not provided, it returns
 * `undefined`.
 *
 * @param name The name of the icon to look up.
 * @param scale The scale of the icon to look up.
 * @param size The size of the icon to look up. Defaults to `64`.
 *
 * @returns The {@link Gtk.IconPaintable} object if the icon is found, or null
 * if not found.
 */
export const lookUpIcon = (
	name: string,
	scale: number,
	size = 64,
	fallbackIconName: string = "image-missing-symbolic"
  ): Gtk.IconPaintable | undefined => {
	if (!name) return undefined;
	const display = Gdk.Display.get_default();
	if (!display) return undefined;

	return Gtk.IconTheme.get_for_display(display).lookup_icon(
		name,
		[fallbackIconName, "image-missing-symbolic"],
		size,
		scale,
		Gtk.TextDirection.NONE,
		null
	);
};
