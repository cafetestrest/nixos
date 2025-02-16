import AstalWp from "gi://AstalWp?version=0.1";
import { Gtk, hook } from "astal/gtk3";
import { bind, Variable} from "astal";
import icons from "../../../lib/icons";
import { spacing } from "../../../lib/variables";
import { Menu } from "../pages/Main";

let WireplumberService: AstalWp.Wp | null;
try {
	WireplumberService = AstalWp.get_default();
} catch (_) {
	WireplumberService = null;
}

const Audio = WireplumberService && WireplumberService.audio;

export const revealSinks = Variable(false);

export const SinkRevealer = () => Audio && (
	<Menu
		name={"sink-selector"}
		bindVariable={revealSinks}
		content={[
			<box vertical={true} spacing={spacing * 2} className={"sink-box"}>
				<label
					label={"Audio source"}
					className={"control-center__dropdown-menu_title"}
				/>
				{bind(Audio, 'speakers').as((speakers) => {
					return speakers.map((speaker) => {
						return (
							<button
								className={"sink-choose-button qs-menu cotrol-center-menu-button"}
								onClick={() =>
									speaker.set_is_default(true)
								}
							>
								<box>
									<icon icon={bind(speaker, 'icon').as((icon) => {
										switch (icon) {
											case 'audio-headset-bluetooth':
											case 'audio-headset-analog-usb':
												return icons.audio.type.headset;
											case 'audio-card-analog-usb':
												return icons.audio.type.speaker;
											case 'audio-card-analog-pci':
												return icons.audio.volume.high;
											default:
												return icons.audio.type.card;
										}
									})} />
									<box hexpand />
									<label label={bind(speaker, 'description').as((desc) => {
										if (desc.includes("HDMI Audio"))
											return "HDMI Audio";

										if (desc.includes("USB"))
											return "USB Audio";

										return desc;
									})} truncate={true} maxWidthChars={40} />
									<box hexpand />
									<icon visible={bind(speaker, 'is_default')} icon={icons.ui.tick} />
								</box>
							</button>
						);
					});
				})}
			</box>
		]}
	/>
)

export default () => {
	const speaker = AstalWp.get_default()?.audio.defaultSpeaker!;

	// using custom VolumeSlider from https://github.com/Mabi19/desktop-shell/blob/cd442d22bb44cedcdaf23399e400808df8b2e78d/bar/audio.tsx#L8-L34
	// only as currently <slider/> does not support onScroll (mouse scrol to change value)
	const VolumeSlider = ({ device }: { device: AstalWp.Endpoint }) => {
		const adjustment = new Gtk.Adjustment({
			lower: 0,
			upper: 1,
			value: device.volume,
			stepIncrement: 0.01,
			pageIncrement: 0.01,
		});
		const scale = new Gtk.Scale({
			adjustment,
			hexpand: true,
			visible: true,
			draw_value: false,
		});
		scale.connect("change-value", (_, type, value) => {
			value = Math.round(Math.max(0, Math.min(value * 100, 100))) / 100;
			device.volume = value;
		});
		hook(scale, device, "notify::volume", () => {
			const volume = device.volume;
			if (Math.abs(adjustment.value - volume) > 0.001) {
				adjustment.value = volume;
			}

			if (volume === 0) {
				device.mute = true;
			} else if (device.mute) {
				device.mute = false;
			}
		});

		return scale;
	};

	return (
		<box
			className={bind(speaker, "mute").as((mute) =>
				mute ? "muted" : "",
			)}
		>
			<overlay
				className={"control-center__volume-slider volume"}
				child={
					// <slider
					// 	className={"volumeslider"}
					// 	draw_value={false}
					// 	hexpand={true}
					// 	onDragged={({ value }) => {
					// 		if (value === 0) {
					// 			speaker.volume = value;
					// 			speaker.mute = true;
					// 		} else {
					// 			speaker.volume = value;
					// 			speaker.mute = false;
					// 		}
					// 	}}
					// 	value={bind(speaker, "volume")}
					// />
					<box className={"volumeslider-box"}>
						<VolumeSlider device={speaker} />
					</box>
				}
				overlay={
					<icon
						className={"control-center__slider-icon"}
						icon={bind(speaker, "volumeIcon")}
						hexpand={false}
						halign={Gtk.Align.START}
					/>
				}
			/>
		</box>
	);
};
