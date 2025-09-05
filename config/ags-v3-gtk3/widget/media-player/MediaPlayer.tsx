import { Gtk } from "ags/gtk3";
import Mpris from "gi://AstalMpris";
import { qsShowMediaPlayer } from "../common/Variables";
import { createBinding, For } from "ags";
// import { isIcon } from "../../lib/utils";

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

    const title = createBinding(player, "title").as(t =>
        t || "Unknown Track")

    const artist = createBinding(player, "artist").as(a =>
        a || "Unknown Artist")

    const coverArt = createBinding(player, "coverArt").as(c =>
        `background-image: radial-gradient(circle, rgba(0,0,0, 0.75) 10%, rgba(0,0,0, 0.75)), url("${c}");`)

    // const playerIcon = createBinding(player, "entry").as(e => 
    //     isIcon(e) ? e : "audio-x-generic-symbolic")

    const playerIcon = "audio-x-generic-symbolic";

    const position = createBinding(player, "position").as(p => player.length > 0
        ? p / player.length : 0)

    const playIcon = createBinding(player, "playbackStatus").as(s =>
        s === Mpris.PlaybackStatus.PLAYING
            ? "media-playback-pause-symbolic"
            : "media-playback-start-symbolic"
    )

    return <box
            class={"media-player"}
            css={coverArt}
            visible={createBinding(player, "playback_status").as((status) => status != Mpris.PlaybackStatus.STOPPED)}
        >
        <box vertical={true}>
            <box class={"title"}>
                <label truncate={true} hexpand={true} halign={START} label={title} maxWidthChars={36} />
                <icon icon={playerIcon} />
            </box>
            <label
                halign={START}
                valign={START}
                wrap={true}
                label={artist}
                truncate={true}
                maxWidthChars={20}
            />
            <slider
                visible={createBinding(player, "length").as(l => l > 0)}
                onDragged={({ value }) => player.position = value * player.length}
                value={position}
            />
            <centerbox class={"actions"}>
                <label
                    hexpand={true}
                    class={"position"}
                    halign={START}
                    visible={createBinding(player, "length").as(l => l > 0)}
                    label={createBinding(player, "position").as(lengthStr)}
                />
                <box>
                    <button
                        onClicked={() => player.previous()}
                        visible={createBinding(player, "canGoPrevious")}>
                        <icon icon="media-skip-backward-symbolic" />
                    </button>
                    <button
                        onClicked={() => player.play_pause()}
                        visible={createBinding(player, "canControl")}>
                        <icon icon={playIcon} />
                    </button>
                    <button
                        onClicked={() => player.next()}
                        visible={createBinding(player, "canGoNext")}>
                        <icon icon="media-skip-forward-symbolic" />
                    </button>
                </box>
                <label
                    class={"length"}
                    hexpand={true}
                    halign={END}
                    visible={createBinding(player, "length").as(l => l > 0)}
                    label={createBinding(player, "length").as(l => l > 0 ? lengthStr(l) : "0:00")}
                />
            </centerbox>
        </box>
    </box>
}

export default function MprisPlayers() {
    if (qsShowMediaPlayer === false) {
        return (
            <box visible={false}/>
        );
    }

    const mpris = Mpris.get_default();

    return (
        <box vertical={true}>
            <For each={createBinding(mpris, "players")}>
                {(pla: Mpris.Player) => <MediaPlayer player={pla} />}
            </For>
        </box>
    );
}
