import { Gtk, Widget, App } from "astal/gtk4";

type ProgressProps = {
	height?: number;
	width?: number;
	vertical?: boolean;
	child: Gtk.Widget;
};

export default ({
	height = 1.286,
	width = 12.857,
	vertical = false,
	child,
}: ProgressProps) => {
	const fill = Widget.Box({
		cssClasses: ["fill"],
		hexpand: vertical,
		vexpand: !vertical,
		halign: vertical ? Gtk.Align.FILL : Gtk.Align.START,
		valign: vertical ? Gtk.Align.END : Gtk.Align.FILL,
		child,
	});

	const container = Widget.Box({
		cssClasses: ["progress"],
		child: fill,
		setup(self) {
			App.apply_css(`.progress {
				min-width: ${width}rem;
				min-height: ${height}rem;
			}`);
		},
	});

	return Object.assign(container, {
		setMute(muted: boolean) {
			if (muted) {
				fill.add_css_class("muted")
			} else {
				fill.remove_css_class("muted")
			}
		},

		setValue(value: number, muted: boolean) {
			if (value < 0) return;

			if (muted) {
				fill.add_css_class("muted")
			} else {
				fill.remove_css_class("muted")
			}

			const axis = vertical ? "height" : "width";
			const axisv = vertical ? height : width;
			const min = vertical ? width : height;
			const preferred = (axisv - min) * value + min;

			App.apply_css(`.fill {
				min-${axis}: ${preferred}rem;
			}`);
		},
	});
};
