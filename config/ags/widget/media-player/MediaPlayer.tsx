import { Gtk } from "astal/gtk3"
import Mpris from "gi://AstalMpris"
import { bind } from "astal"

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

function MediaPlayer({ player }: { player: Mpris.Player }) {
    const { START, END } = Gtk.Align

    const title = bind(player, "title").as(t =>
        t || "Unknown Track")

    const artist = bind(player, "artist").as(a =>
        a || "Unknown Artist")

    const coverArt = bind(player, "coverArt").as(c =>
        `background-image: radial-gradient(circle, rgba(0,0,0, 0.75) 10%, rgba(0,0,0, 0.75)), url("${c}");`)

    // const playerIcon = bind(player, "entry").as(e =>
    //     Astal.Icon.lookup_icon(e) ? e : "audio-x-generic-symbolic")

    const playerIcon = "audio-x-generic-symbolic";

    const position = bind(player, "position").as(p => player.length > 0
        ? p / player.length : 0)

    const playIcon = bind(player, "playbackStatus").as(s =>
        s === Mpris.PlaybackStatus.PLAYING
            ? "media-playback-pause-symbolic"
            : "media-playback-start-symbolic"
    )

    return <box
            className={"MediaPlayer"}
            css={coverArt}
            visible={bind(player, "playback_status").as((status) => status != Mpris.PlaybackStatus.STOPPED)}
        >
        <box vertical>
            <box className={"title"}>
                <label truncate hexpand halign={START} label={title} maxWidthChars={36} />
                <icon icon={playerIcon} />
            </box>
            <label
                halign={START}
                valign={START}
                wrap
                label={artist}
                truncate
                maxWidthChars={20}
            />
            <slider
                visible={bind(player, "length").as(l => l > 0)}
                onDragged={({ value }) => player.position = value * player.length}
                value={position}
            />
            <centerbox className={"actions"}>
                <label
                    hexpand
                    className={"position"}
                    halign={START}
                    visible={bind(player, "length").as(l => l > 0)}
                    label={bind(player, "position").as(lengthStr)}
                />
                <box>
                    <button
                        onClicked={() => player.previous()}
                        visible={bind(player, "canGoPrevious")}>
                        <icon icon="media-skip-backward-symbolic" />
                    </button>
                    <button
                        onClicked={() => player.play_pause()}
                        visible={bind(player, "canControl")}>
                        <icon icon={playIcon} />
                    </button>
                    <button
                        onClicked={() => player.next()}
                        visible={bind(player, "canGoNext")}>
                        <icon icon="media-skip-forward-symbolic" />
                    </button>
                </box>
                <label
                    className={"length"}
                    hexpand
                    halign={END}
                    visible={bind(player, "length").as(l => l > 0)}
                    label={bind(player, "length").as(l => l > 0 ? lengthStr(l) : "0:00")}
                />
            </centerbox>
        </box>
    </box>
}

export default function MprisPlayers() {
    const mpris = Mpris.get_default()
    return <box vertical>
        {bind(mpris, "players").as(arr => arr.map(player => (
            <MediaPlayer player={player} />
        )))}
    </box>
}
