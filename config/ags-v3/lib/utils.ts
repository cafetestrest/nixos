import GLib from "gi://GLib";
import Gio from "gi://Gio?version=2.0";
import { monitorFile } from "ags/file";
import { readFileAsync, writeFileAsync } from "ags/file";

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

export function ensureDirectory(path: string) {
	if (!GLib.file_test(path, GLib.FileTest.EXISTS))
		Gio.File.new_for_path(path).make_directory_with_parents(null);
}

export const fileExists = (path: string) =>
    GLib.file_test(path, GLib.FileTest.EXISTS);

export function throttle<T extends (...args: any[]) => void>(waitMs: number, fn: T): T {
    let lastCall = 0;

    return ((...args: any[]) => {
        const now = Date.now();
        if (now - lastCall >= waitMs) {
            lastCall = now;
            fn(...args);
        }
    }) as T;
}

export const chunk = <T,>(arr: T[], size: number): T[][] =>
    Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
        arr.slice(i * size, i * size + size),
    );