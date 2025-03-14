import { Gtk, Widget } from "astal/gtk4";
import { bind } from "astal";
import PopupMenu from "../PopupMenu";
import AstalWp from "gi://AstalWp?version=0.1";
import icons from "../../../lib/icons";
import { lookUpIcon } from "../../../lib/utils";

const audio = AstalWp.get_default()?.audio!;

const SinkItem = (device: AstalWp.Endpoint) => (
	<button
		cssClasses={["popup-menu__item"]}
		hexpand={true}
		on_clicked={() => device.set_is_default(true)}
	>
		{
			new Gtk.Box({
				children: [
					new Gtk.Image({
						iconName: lookUpIcon(device.icon)
							? device.icon
							: icons.fallback.audio,
						tooltipText: device.icon,
					}),
					new Gtk.Label({
						label: (device.description || "")
							.split(" ")
							.slice(0, 4)
							.join(" "),
					}),
					new Gtk.Image({
						iconName: icons.ui.tick,
						hexpand: true,
						halign: Gtk.Align.END,
						visible: bind(device, "isDefault"),
					}),
				],
			})
		}
	</button>
);

export const Sinks = () => (
	<box vertical>
		{bind(audio, "speakers").as((speaker) => speaker.map(SinkItem))}
	</box>
);

export default () => {
	return (
		<PopupMenu label="Sink">
			<box vertical>
				{bind(audio, "speakers").as((speaker) => speaker.map(SinkItem))}
			</box>
		</PopupMenu>
	);
};
