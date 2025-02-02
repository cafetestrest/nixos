import { Gtk, Widget } from "astal/gtk4";
import { bind } from "astal";
import PopupMenu from "../PopupMenu";
import AstalWp from "gi://AstalWp?version=0.1";
import icons from "../../../lib/icons";
import Pango from "gi://Pango";

const audio = AstalWp.get_default()?.audio!;

const MixerItem = (stream: AstalWp.Endpoint) => {
	return Widget.Box({
		hexpand: true,
		cssClasses: ["popup-menu__item", "mixer__item"],
		spacing: 16,
		children: [
			Widget.Image({
				cssClasses: ["mixer__tooltip"],
				tooltipText: bind(stream, "name").as((name) => name || ""),
				pixelSize: 32,
				iconName: bind(stream, "icon").as(
					(icon) => icon || icons.fallback.audio,
				),
			}),
			Widget.Box({
				vertical: true,
				children: [
					Widget.Label({
						xalign: 0,
						ellipsize: Pango.EllipsizeMode.END,
						label: bind(stream, "name").as(
							(name) => name || "",
						),
					}),
					Widget.Slider({
						cssClasses: ["mixer__slider"],
						hexpand: true,
						drawValue: false,
						value: bind(stream, "volume"),
						// onDragged: ({ value }) => (stream.volume = value),//TODOfix
					}),
				],
			}),
			Widget.Label({
				cssClasses: ["mixer__value"],
				// xalign: 0.5,
				label: bind(stream, "volume").as(
					(v) => `${Math.floor(v * 100)}%`,
				),
			}),
		],
	});
};

const Placeholder = () => (
	<box
		name="placeholder"
		cssClasses={["mixer-placeholder"]}
		spacing={16}
		vexpand
		valign={Gtk.Align.CENTER}
		halign={Gtk.Align.CENTER}
	>
		<label label="" />
	</box>
);

export const MixerMenu = () => (
	<box
		cssClasses={["mixermenu"]}
	>
		{bind(audio, "streams").as((streams) => (
			<stack
				transitionType={Gtk.StackTransitionType.CROSSFADE}
				transitionDuration={500}
				visibleChildName={streams.length > 0 ? "streams" : "placeholder"}
			>
				<box vertical name={"streams"}>
					{streams.map(MixerItem)}
				</box>
				<Placeholder />
			</stack>
		))}
	</box>
);

export default () => {
	return (
		<PopupMenu label="Mixer">
			{bind(audio, "streams").as((streams) => (
				<stack
					transitionType={Gtk.StackTransitionType.CROSSFADE}
					transitionDuration={500}
					visibleChildName={streams.length > 0 ? "streams" : "placeholder"}
				>
					<box vertical name={"streams"}>
						{streams.map(MixerItem)}
					</box>
					<Placeholder />
				</stack>
			))}
		</PopupMenu>
	);
};
