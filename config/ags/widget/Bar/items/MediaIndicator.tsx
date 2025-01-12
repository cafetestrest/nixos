import { Widget } from "astal/gtk3";
import { bind, Variable } from "astal";
import AstalMpris from "gi://AstalMpris?version=0.1";
import icons from "../../../lib/icons";
import { lookUpIcon } from "../../../lib/utils";
import BarButton from "../BarButton";

type PlayerProps = {
	player: AstalMpris.Player;
};

const revealMedia = Variable(true);

const Player = ({ player }: PlayerProps) => {
	const PlayerIcon = () => (
		<icon
			icon={bind(player, "entry").as((i) =>
				lookUpIcon(`${i}-symbolic`) ? `${i}-symbolic` : lookUpIcon(i) ? i : icons.fallback.audio,
			)}
			className="player__icon"
			visible={bind(player, 'coverArt').as((c) => c === '')}
		/>
	);

	const coverArt = bind(player, 'coverArt').as(
        (c) => {
			if (c)
				return `background-image: url('${c}')`
			return `background-image: none`
		},
    )

	const PlayerIconCover = () => (
		<box className="player-icon-cover-art" css={coverArt} visible={bind(player, 'coverArt').as((c) => c !== '')}/>
	);

	const Title = new Widget.Label({
		label: player.get_title(),
		maxWidthChars: 40,
		truncate: true,
		className: "player__title",
	});

	const Artist = new Widget.Label({
		label: player.get_artist(),
		maxWidthChars: 20,
		truncate: true,
		className: "player__artist",
	});

	const ControlButton = ({ icon, onClick, className }: { icon: string; onClick: () => void; className: string }) => (
		<BarButton onClicked={onClick} className={className}>
			<icon icon={icon} />
		</BarButton>
	);

	const PlayPauseButton = ({ className }: Widget.ButtonProps) => (
		<BarButton
			onClicked={() => player.play_pause()}
			className={`player__playpause ${className}`}
			setup={(self) => {
				const toggleActive = () => {
					self.toggleClassName("active", player.playbackStatus === AstalMpris.PlaybackStatus.PLAYING);
				};
				toggleActive();
				self.hook(player, "notify::playback-status", toggleActive);
			}}
		>
			<icon
				icon={bind(player, "playbackStatus").as((status) =>
					status === AstalMpris.PlaybackStatus.PLAYING ? icons.media.playing : icons.media.stopped,
				)}
			/>
		</BarButton>
	);

	return (
		<box
		className={`player player-${player.busName}`}
		visible={bind(player, "playback_status").as((v) => {
			if (v != 2)
				return true;
			return false;
		})}
		>
			<BarButton
				className={"media-player-icon-button"}
				onClick={() =>
					revealMedia.set(!revealMedia.get())
				}
			>
				<box>
					<PlayerIcon />
					<PlayerIconCover />
				</box>
			</BarButton>
			<revealer
				className={"media-revealer"}
				revealChild={bind(revealMedia)}
				visible={bind(revealMedia)}
			>
				<box>
					<BarButton
						className={"media-player-title-box-button"}
						onClicked={() => player.play_pause()}
					>
						<box>
							<box className="player__title-box"
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
