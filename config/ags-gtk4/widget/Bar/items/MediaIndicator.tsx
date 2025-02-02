import { Widget, App, Gtk, hook } from "astal/gtk4";
import { bind, Variable } from "astal";
import AstalMpris from "gi://AstalMpris?version=0.1";
import icons from "../../../lib/icons";
import { lookUpIcon } from "../../../lib/utils";
import BarButton from "../BarButton";
import Pango from "gi://Pango";

type PlayerProps = {
	player: AstalMpris.Player;
};

const revealMedia = Variable(true);

const Player = ({ player }: PlayerProps) => {
	const PlayerIcon = () => (
		<image
			// iconName={bind(player, "entry").as((i) =>
			// 	lookUpIcon(`${i}-symbolic`) ? `${i}-symbolic` : lookUpIcon(i) ? i : icons.fallback.audio,
			// )} //TODOfix lookUpIcon?
			iconName={icons.fallback.audio}
			cssClasses={["player__icon"]}
			visible={bind(player, 'coverArt').as((c) => c === '')}
		/>
	);

	const PlayerIconCover = () => (
		<box cssClasses={["player-icon-cover-art", `${player.identity}`]}
			visible={bind(player, 'coverArt').as((c) => c !== '')}
		/>
	);

	const Title = new Gtk.Label({
		label: player.get_title(),
		maxWidthChars: 40,
		ellipsize: Pango.EllipsizeMode.END,
		cssClasses: ["player__title"],
	});

	const Artist = new Gtk.Label({
		label: player.get_artist(),
		maxWidthChars: 20,
		ellipsize: Pango.EllipsizeMode.END,
		cssClasses: ["player__artist"],
	});

	const ControlButton = ({ icon, onClick, className }: { icon: string; onClick: () => void; className: string }) => (
		<BarButton onClicked={onClick} className={className}>
			<image iconName={icon} />
		</BarButton>
	);

	const PlayPauseButton = () => (
		<BarButton
			onClicked={() => player.play_pause()}
			className="player__playpause"
			setup={(self) => {
				const toggleActive = () => {
					if (player.playbackStatus === AstalMpris.PlaybackStatus.PLAYING) {
						self.add_css_class("active");
					} else {
						self.remove_css_class("active");
					}
				};
				toggleActive();
				hook(self, player, "notify::playback-status", toggleActive)
			}}
		>
			<image
				iconName={bind(player, "playbackStatus").as((status) =>
					status === AstalMpris.PlaybackStatus.PLAYING ? icons.media.playing : icons.media.stopped,
				)}
			/>
		</BarButton>
	);

	return (
		<box
		cssClasses={["player", `player-${player.busName}`]}
		visible={bind(player, "playback_status").as((v) => {
			if (v != 2)
				return true;
			return false;
		})}
		>
			<BarButton
				className="media-player-icon-button"
				onClicked={() =>
					revealMedia.set(!revealMedia.get())
				}
			>
				<box>
					<PlayerIcon />
					<PlayerIconCover />
				</box>
			</BarButton>
			<revealer
				cssClasses={["media-revealer"]}
				revealChild={bind(revealMedia)}
				visible={bind(revealMedia)}
			>
				<box>
					<BarButton
						className="media-player-title-box-button"
						onClicked={() => player.play_pause()}
					>
						<box>
							<box cssClasses={["player__title-box"]}
							setup={(self) => {
									hook(self, player, "notify::title", (_) => {
										if (!self.has_css_class("dissappear")) {
											self.add_css_class("dissappear");
										}
										setTimeout(() => {
											if (self.has_css_class("dissappear")) {
												self.remove_css_class("dissappear");
											}
											Title.label = player.title;
											Artist.label = player.artist;
										}, 300);
									});
								}}
							>{Title}   {Artist}</box>
						</box>
					</BarButton>
				</box>
			</revealer>
			<box visible={bind(player, "canGoPrevious")}>
				<ControlButton icon={icons.media.goprev} onClick={() => player.previous()} className="player__previous" />
			</box>
			<PlayPauseButton />
			<box visible={bind(player, "canGoNext")}>
				<ControlButton icon={icons.media.gonext} onClick={() => player.next()} className="player__next" />
			</box>
		</box>
	)
};

export default () => {
	const mpris = AstalMpris.get_default();

    return <box>
        {bind(mpris, "players").as(arr => arr.map(player => {
				return (<Player player={player} />)
			}
		))}
    </box>
};
