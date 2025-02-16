import { Gtk, Gdk, Widget, Astal } from "astal/gtk3";
import { bind, timeout } from "astal";
import Progress from "./Progress";
import AstalWp from "gi://AstalWp?version=0.1";
import icons from "../../lib/icons";
import Brightness from "../../service/Brightness";

export const namespace = "osd";
const DELAY = 2500;

function OnScreenProgress(window: Astal.Window, vertical: boolean) {
	const speaker = AstalWp.get_default()?.audio.defaultSpeaker!;

	const indicator = new Widget.Icon({
		pixelSize: 20,
		valign: Gtk.Align.CENTER,
		icon: bind(speaker, "volumeIcon"),
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
		window.visible = true;
		indicator.icon = icon;
		progress.setValue(value, muted);
		count++;
		timeout(DELAY, () => {
			count--;
			if (count === 0) window.visible = false;
		});
	}

	return new Widget.Box({
		className: "indicator",
		halign: Gtk.Align.CENTER,
		valign: Gtk.Align.END,
		css: "min-height: 0.143rem;",
		child: <box vertical={true} className={"osd-indicator-box"}>
			<icon icon={bind(speaker, "volumeIcon")} className={"osd-indicator-icon"} />
			{progress}
		</box>,
		setup: () => {
			progress.hook(speaker, "notify::mute", () => {
				progress.setMute(speaker.mute);
			});
			progress.hook(speaker, "notify::volume", () => {
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
				progress.hook(Brightness, () =>
					show(Brightness!.screen, icons.brightness.screen, false),
				);
			}
		},
	});
}

export default (gdkmonitor: Gdk.Monitor) => (
	<window
		visible={false}
		className="OSD"
		namespace={namespace}
		gdkmonitor={gdkmonitor}
		layer={Astal.Layer.OVERLAY}
		// anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
		setup={(self) => {
			self.add(
				<box className={namespace} vertical={true}>
					{OnScreenProgress(self, false)}
				</box>,
			);
		}}
	></window>
);
