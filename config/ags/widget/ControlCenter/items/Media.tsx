import { Gtk, Gdk, Widget } from "astal/gtk3";
import { bind, Variable } from "astal";
import AstalMpris from "gi://AstalMpris?version=0.1";
import icons from "../../../lib/icons";
import { hexToRgb, lookUpIcon } from "../../../lib/utils";
import PlayerColorsService from "../../../service/PlayerColors";
import { Colors } from "../../../lib/variables";

type PlayerProps = {
	player: AstalMpris.Player;
};

const Player = ({ player }: PlayerProps) => {
	const PlayerColors = PlayerColorsService(player);

	const updateColors = (element: Gtk.Widget, colors: Colors | null, background: "image" | "container"  = "container") => {
		if (colors) {
			const { r, g, b } = hexToRgb(colors.primary)!;
			element.css =
                background  == "image"
                    ?   `background-image: radial-gradient(circle,
                                    rgba(${r}, ${g}, ${b}, 0.05) 10%,
                                    rgba(${r}, ${g}, ${b}, 0.6)),
                                    radial-gradient(circle, rgba(0,0,0, 0.25) 10%, rgba(0,0,0, 0.25)),
                                    url("${player.coverArt}");
                        color: ${colors.on_primary};`
                    :   `background-color: ${colors.primary_container};
                        color: ${colors.on_primary_container};`
        }
	};

	const PlayerIcon = () => (
		<icon
			halign={Gtk.Align.END}
			valign={Gtk.Align.START}
			icon={bind(player, "entry").as((i) =>
				lookUpIcon(`${i}-symbolic`) ? `${i}-symbolic` : lookUpIcon(i) ? i : icons.fallback.audio,
			)}
			className="player__icon"
		/>
	);

	const Title = new Widget.Label({
		label: player.get_title(),
		truncate: true,
		className: "player__title",
		halign: Gtk.Align.START,
	});

	const Artist = new Widget.Label({
		label: player.get_artist(),
		truncate: true,
		className: "player__artist",
		halign: Gtk.Align.START,
	});

	const ControlButton = ({ icon, onClick, className }: { icon: string; onClick: () => void; className: string }) => (
		<button hexpand={false} valign={Gtk.Align.CENTER} onClicked={onClick} className={className}>
			<icon icon={icon} />
		</button>
	);

	const PlayPauseButton = ({ className }: Widget.ButtonProps) => (
		<button
			onClicked={() => player.play_pause()}
			className={`player__playpause ${className}`}
			setup={(self) => {
				const toggleActive = () => {
					self.toggleClassName("active", player.playbackStatus === AstalMpris.PlaybackStatus.PLAYING);
				};
				toggleActive();
				self.hook(player, "notify::playback-status", toggleActive);
				self.hook(PlayerColors, "notify::colors", () => updateColors(self, PlayerColors.colors!));
			}}
		>
			<icon
				icon={bind(player, "playbackStatus").as((status) =>
					status === AstalMpris.PlaybackStatus.PLAYING ? icons.media.playing : icons.media.stopped,
				)}
			/>
		</button>
	);

	const PositionSlider = () => (
		<slider
			className="player__position-slider"
			drawValue={false}
			hexpand
			value={bind(player, "position").as((p) => (player.length > 0 ? p / player.length : p * 0.01))}
			onDragged={({ value }) => {
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
		const min = Math.floor(length / 60);
		const sec = Math.floor(length % 60);
		const sec0 = sec < 10 ? '0' : '';
		return `${min}:${sec0}${sec}`;
	}

	return (
		<box
			name={player.busName}
			vertical
			className={`player player-${player.busName}`}
			vexpand
			setup={(self) => self.hook(PlayerColors, "notify::colors", () => {updateColors(self, PlayerColors.colors, "image")})}
			visible={bind(player, "playback_status").as((v) => {
				if (v != 2) {
					return true;
				}
				return false;
			})}
		>
			<box className={"cover-box"} vertical={false}>
				<box>
					<box className="cover-art" css={coverArt} />
				</box>
				<box vertical>
					<box>
						<box vertical halign={Gtk.Align.START} vexpand valign={Gtk.Align.CENTER} className="player__title-box"
						setup={(self) => {
								self.hook(player, "notify::title", (_) => {
									self.toggleClassName("dissappear", true);
									setTimeout(() => {
										self.toggleClassName("dissappear", false);
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
							<label className={"player-position"} halign={Gtk.Align.START} label={bind(player, "position").as((v) => lengthStr(v))} visible={bind(player, "length").as((v) => v > 0)}/>
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
							<label className={"player-length"} halign={Gtk.Align.END} label={bind(player, "length").as((v) => lengthStr(v))} visible={bind(player, "length").as((v) => v > 0)}/>
						</box>
					</box>
				</box>

				{/* <box hexpand vexpand valign={Gtk.Align.CENTER}>
					<box hexpand/>
				</box> */}
			</box>
		</box>
	);
};

const PlayerSwitcher = ({ mpris, selectedPlayer }: { mpris: AstalMpris.Mpris; selectedPlayer: Variable<string> }) => {
	const players = bind(mpris, "players");

	const changePlayer = (direction: number) => {
		const allPlayers = mpris.get_players();
		const index = allPlayers.findIndex((p) => p.busName === selectedPlayer.get());
		selectedPlayer.set(allPlayers[(index + direction + allPlayers.length) % allPlayers.length].busName);
	};

	return (
		<revealer revealChild={players.as((p) => p.length > 0)} >
			<overlay>
				<eventbox onScroll={(self, event) => changePlayer(event.direction === Gdk.ScrollDirection.UP ? 1 : -1)}>
					<stack
						transitionType={Gtk.StackTransitionType.SLIDE_LEFT_RIGHT}
						transitionDuration={300}
						interpolateSize
						shown={bind(selectedPlayer)}
					>
						{players.as((ps) => ps.map((player) => <Player player={player} />))}
					</stack>
				</eventbox>
				<revealer valign={Gtk.Align.END} halign={Gtk.Align.CENTER} revealChild={players.as((p) => p.length > 1)} visible={false}>
					<box valign={Gtk.Align.END} halign={Gtk.Align.CENTER} spacing={4}>
						{players.as((ps) =>
							ps.map((player, idx) => (
								<box
									className="player__indicator"
									setup={(self) => {
										if (idx === 0) selectedPlayer.set(player.busName);
										self.toggleClassName("selected", selectedPlayer.get() === player.busName);
										self.hook(selectedPlayer, (_, selected) => {
											self.toggleClassName("selected", selected === player.busName);
										});
									}}
								></box>
							)),
						)}
					</box>
				</revealer>
			</overlay>
		</revealer>
	);
};

export default () => {
	const mpris = AstalMpris.get_default();

    return <box vertical className={"qs-media-indicator"}>
        {bind(mpris, "players").as(arr => arr.map(player => {
				return (<Player player={player} />)
			}
		))}
    </box>

	// const selectedPlayer = Variable<string>("");
	// return <PlayerSwitcher mpris={mpris} selectedPlayer={selectedPlayer} />;
};
