import { Gtk, Gdk, Widget, Astal, hook } from "astal/gtk4";
import { bind, timeout, Variable } from "astal";
import Progress from "./Progress";
import AstalWp from "gi://AstalWp?version=0.1";
import icons from "../../lib/icons";
import Brightness from "../../service/Brightness";

export const namespace = "osd";
const DELAY = 2500;

type OnScreenProgressProps = {
	vertical: boolean;
	visible: Variable<boolean>;
};

function OnScreenProgress({visible, vertical}: OnScreenProgressProps) {
	const speaker = AstalWp.get_default()?.audio.defaultSpeaker!;

	const indicator = Widget.Image({
		cssClasses: ["osd-volume-icon"],
		valign: Gtk.Align.CENTER,
		iconName: bind(speaker, "volumeIcon"),
	});

	const progress = Progress({
		vertical,
		width: 14,
		height: 0.6,
		child: <box></box>
	});

	let count = 0;
	let firstStart = true;

	function show(value: number, icon: string, muted: boolean) {
		visible.set(true);
		indicator.iconName = icon;
		progress.setValue(value, muted);
		count++;
		timeout(DELAY, () => {
			count--;
			if (count === 0) visible.set(false);
		});
	}

	return Widget.Box({
		cssClasses: ["indicator"],
		halign: Gtk.Align.CENTER,
		valign: Gtk.Align.END,
		child: <box vertical={true} cssClasses={["osd-indicator-box"]}>
			<image iconName={bind(speaker, "volumeIcon")} cssClasses={["osd-indicator-icon"]} pixelSize={100} valign={Gtk.Align.START} />
			<label vexpand={true} label={" "} />
			{progress}
		</box>,
		setup: () => {
			hook(progress, speaker, "notify::mute", () => {
				progress.setMute(speaker.mute);
			});
			hook(progress, speaker, "notify::volume", () => {
				if (firstStart) {
					firstStart = false;
					return;
				}

				return show(
					speaker.volume,
					icons.audio.type.speaker,
					speaker.mute,
				);
			});
			if (Brightness) {
				hook(progress, Brightness, () =>
					show(Brightness!.screen, icons.brightness.screen, false),
				);
			}
		},
	});
}

export default (gdkmonitor: Gdk.Monitor) => {
    const visible = Variable(false);

	return (
	<window
		visible={bind(visible)}
		cssClasses={["OSD"]}
		namespace={namespace}
		gdkmonitor={gdkmonitor}
		layer={Astal.Layer.OVERLAY}
		// anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
	>
		<box cssClasses={[namespace]} vertical={true}>
			<OnScreenProgress vertical={false} visible={visible} />
		</box>
	</window>
)};
