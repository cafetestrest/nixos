import AstalWp from "gi://AstalWp?version=0.1";
import { Gtk } from "astal/gtk3";
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
									<icon icon={bind(speaker, 'is_default').as((def) => true === def ? icons.ui.tick : "")} />
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

	return (
		<box
			className={bind(speaker, "mute").as((mute) =>
				mute ? "muted" : "",
			)}
		>
			<overlay
				className={"control-center__volume-slider volume"}
				child={
					<slider
						className={"volumeslider"}
						draw_value={false}
						hexpand={true}
						onDragged={({ value }) => {
							if (value === 0) {
								speaker.volume = value;
								speaker.mute = true;
							} else {
								speaker.volume = value;
								speaker.mute = false;
							}
						}}
						value={bind(speaker, "volume")}
					/>
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
