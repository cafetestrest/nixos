import { Gtk, Gdk, Widget, App, hook } from "astal/gtk4";
import { bind, Variable } from "astal";
import AstalMpris from "gi://AstalMpris?version=0.1";
import icons from "../../../lib/icons";
import { lookUpIcon } from "../../../lib/utils";
import Pango from "gi://Pango";

type PlayerProps = {
	player: AstalMpris.Player;
};

const Player = ({ player }: PlayerProps) => {
	const PlayerIcon = () => (
		<image
			halign={Gtk.Align.END}
			valign={Gtk.Align.START}
			// iconName={bind(player, "entry").as((i) =>
			// 	lookUpIcon(`${i}-symbolic`) ? `${i}-symbolic` : lookUpIcon(i) ? i : icons.fallback.audio,
			// )} //TODOfix 
			iconName={icons.fallback.audio}
			cssClasses={["player__icon"]}
		/>
	);

	const Title = new Gtk.Label({
		label: player.get_title(),
		ellipsize: Pango.EllipsizeMode.END,
		cssClasses: ["player__title"],
		halign: Gtk.Align.START,
	});

	const Artist = new Gtk.Label({
		label: player.get_artist(),
		ellipsize: Pango.EllipsizeMode.END,
		cssClasses: ["player__artist"],
		halign: Gtk.Align.START,
	});

	const ControlButton = ({ icon, onClick, className }: { icon: string; onClick: () => void; className: string }) => (
		<button hexpand={false} valign={Gtk.Align.CENTER} onClicked={onClick} cssClasses={[className]}>
			<image iconName={icon} cssClasses={[`${className}-icon`]}/>
		</button>
	);

	const PlayPauseButton = ({ className }: Widget.ButtonProps) => (
		<button
			onClicked={() => player.play_pause()}
			cssClasses={["player__playpause", `${className}`]}
			setup={(self) => {
				const toggleActive = () => {
					if (player.playbackStatus === AstalMpris.PlaybackStatus.PLAYING) {
						self.add_css_class("active")
					} else {
						self.remove_css_class("active")
					}
				};
				toggleActive();
				hook(self, player, "notify::playback-status", toggleActive);
			}}
		>
			<image
				cssClasses={["player__playpause-icon"]}
				iconName={bind(player, "playbackStatus").as((status) =>
					status === AstalMpris.PlaybackStatus.PLAYING ? icons.media.playing : icons.media.stopped,
				)}
			/>
		</button>
	);

	const PositionSlider = () => (
		<slider
			cssClasses={["player__position-slider"]}
			drawValue={false}
			hexpand
			value={bind(player, "position").as((p) => (player.length > 0 ? p / player.length : p * 0.01))}
			onChangeValue={({ value }) => {
				if (value && value < 0) {
					player.set_position(0);
				} else if (value && value > 1) {
					player.set_position(1);
				} else if (value) {
					player.set_position(player.length > 0 ? value * player.length: value * 100);
				}
			}}
		/>
	);

	const coverArt = bind(player, 'coverArt').as(
		(c) => {
			if (c)
				return `background-image: url('${c}')`
			return `background-image: none`
		},
	)

	function lengthStr(length: number) {
		const hours = Math.floor(length / 3600);
		const minutes = Math.floor((length % 3600) / 60);
		const seconds = Math.floor(length % 60);

		const min0 = minutes < 10 ? '0' : '';
		const sec0 = seconds < 10 ? '0' : '';

		if (hours > 0) {
			return `${hours}:${min0}${minutes}:${sec0}${seconds}`;
		}
		return `${minutes}:${sec0}${seconds}`;
	}

	return (
		<box
			name={player.busName}
			vertical
			cssClasses={["player", `${player.identity}`]}
			vexpand
			setup={() => {
				const updateColors = () => {
					const coverArt = player.cover_art || "";

					if (!coverArt) {
						App.apply_css(`.${player.identity} { background-image: none; }`);
						return;
					}

					//TODOfix move one of these back to bar media logic
					App.apply_css(`.player.${player.identity} { background-image: radial-gradient(circle, rgba(0,0,0, 0.75) 10%, rgba(0,0,0, 0.75)), url("file://${coverArt}"); }`);
					App.apply_css(`.player-icon-cover-art.${player.identity} { background-image: url("file://${coverArt}"); }`);
				};

				updateColors();

				player.connect("notify::cover-art", () => {
					updateColors();
				});
			}}
			visible={bind(player, "playback_status").as((v) => {
				if (v != 2) {
					return true;
				}
				return false;
			})}
		>
			<box cssClasses={["cover-box"]} vertical={false}>
				<box vertical>
					<box>
						<box vertical halign={Gtk.Align.START} vexpand valign={Gtk.Align.CENTER} cssClasses={["player__title-box"]}
						setup={(self) => {
								hook(self, player, "notify::title", (_) => {
									self.add_css_class("dissappear");
									setTimeout(() => {
										self.remove_css_class("dissappear")
										Title.label = player.title;
										Artist.label = player.artist;
									}, 300);
								});
							}}
						>
							{Title}
							{Artist}
						</box>
						<box hexpand />
						<box
							halign={Gtk.Align.END}
							valign={Gtk.Align.START}
						>
							<PlayerIcon />
						</box>
					</box>
					<box vertical>
						<PositionSlider />
						<box vexpand valign={Gtk.Align.END}>
							<label cssClasses={["player-position"]} halign={Gtk.Align.START} label={bind(player, "position").as((v) => lengthStr(v))} visible={bind(player, "length").as((v) => v > 0)}/>
							<box visible={bind(player, "canGoPrevious")}>
								<box hexpand />
								<ControlButton icon={icons.media.prev} onClick={() => player.previous()} className="player__previous" />
							</box>
							<box hexpand />
							<PlayPauseButton/>
							<box hexpand />
							<box visible={bind(player, "canGoNext")}>
								<ControlButton icon={icons.media.next} onClick={() => player.next()} className="player__next" />
								<box hexpand />
							</box>
							<label cssClasses={["player-length"]} halign={Gtk.Align.END} label={bind(player, "length").as((v) => lengthStr(v))} visible={bind(player, "length").as((v) => v > 0)}/>
						</box>
					</box>
				</box>
			</box>
		</box>
	);
};

// const PlayerSwitcher = ({ mpris, selectedPlayer }: { mpris: AstalMpris.Mpris; selectedPlayer: Variable<string> }) => {
// 	const players = bind(mpris, "players");

// 	const changePlayer = (direction: number) => {
// 		const allPlayers = mpris.get_players();
// 		const index = allPlayers.findIndex((p) => p.busName === selectedPlayer.get());
// 		selectedPlayer.set(allPlayers[(index + direction + allPlayers.length) % allPlayers.length].busName);
// 	};

// 	return (
// 		<revealer revealChild={players.as((p) => p.length > 0)} >
// 			<overlay>
// 				<eventbox onScroll={(self, event) => changePlayer(event.direction === Gdk.ScrollDirection.UP ? 1 : -1)}>
// 					<stack
// 						transitionType={Gtk.StackTransitionType.SLIDE_LEFT_RIGHT}
// 						transitionDuration={300}
// 						interpolateSize
// 						shown={bind(selectedPlayer)}
// 					>
// 						{players.as((ps) => ps.map((player) => <Player player={player} />))}
// 					</stack>
// 				</eventbox>
// 				<revealer valign={Gtk.Align.END} halign={Gtk.Align.CENTER} revealChild={players.as((p) => p.length > 1)} visible={false}>
// 					<box valign={Gtk.Align.END} halign={Gtk.Align.CENTER} spacing={4}>
// 						{players.as((ps) =>
// 							ps.map((player, idx) => (
// 								<box
// 									cssClasses={["player__indicator"]}
// 									setup={(self) => {
// 										if (idx === 0) selectedPlayer.set(player.busName);
// 										self.toggleClassName("selected", selectedPlayer.get() === player.busName);
// 										hook(self, selectedPlayer, (_, selected) => {
// 											self.toggleClassName("selected", selected === player.busName);
// 										});
// 									}}
// 								></box>
// 							)),
// 						)}
// 					</box>
// 				</revealer>
// 			</overlay>
// 		</revealer>
// 	);
// };

export default () => {
	const mpris = AstalMpris.get_default();

	return <box vertical cssClasses={["qs-media-indicator"]}>
		{bind(mpris, "players").as(arr => arr.map(player => {
				return (<Player player={player} />)
			}
		))}
	</box>

	// const selectedPlayer = Variable<string>("");
	// return <PlayerSwitcher mpris={mpris} selectedPlayer={selectedPlayer} />;
};
