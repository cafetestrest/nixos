import { Gtk } from "astal/gtk4";
import Mpris from "gi://AstalMpris";
import { bind } from "astal";
import Pango from "gi://Pango";

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
            cssClasses={["MediaPlayer"]}
            css={coverArt}//todo
            visible={bind(player, "playback_status").as((status) => status != Mpris.PlaybackStatus.STOPPED)}
        >
        <box vertical={true}>
            <box cssClasses={["title"]}>
                <label ellipsize={Pango.EllipsizeMode.END} hexpand={true} halign={START} label={title} maxWidthChars={36} />
                <image iconName={playerIcon} />
            </box>
            <label
                halign={START}
                valign={START}
                wrap={true}
                label={artist}
                ellipsize={Pango.EllipsizeMode.END}
                maxWidthChars={20}
            />
            <slider
                visible={bind(player, "length").as(l => l > 0)}
                onChangeValue={( self ) => player.position = self.value * player.length}
                value={position}
            />
            <centerbox cssClasses={["actions"]}>
                <label
                    hexpand={true}
                    cssClasses={["position"]}
                    halign={START}
                    visible={bind(player, "length").as(l => l > 0)}
                    label={bind(player, "position").as(lengthStr)}
                />
                <box>
                    <button
                        onClicked={() => player.previous()}
                        visible={bind(player, "canGoPrevious")}>
                        <image iconName="media-skip-backward-symbolic" />
                    </button>
                    <button
                        onClicked={() => player.play_pause()}
                        visible={bind(player, "canControl")}>
                        <image iconName={playIcon} />
                    </button>
                    <button
                        onClicked={() => player.next()}
                        visible={bind(player, "canGoNext")}>
                        <image iconName="media-skip-forward-symbolic" />
                    </button>
                </box>
                <label
                    cssClasses={["length"]}
                    hexpand={true}
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
    return <box vertical={true}>
        {bind(mpris, "players").as(arr => arr.map(player => (
            <MediaPlayer player={player} />
        )))}
    </box>
}
