import Gtk from "gi://Gtk?version=4.0";
import AstalMpris from "gi://AstalMpris";
import { bind } from "ags/state";
import { For } from "ags/gtk4";
import Pango from "gi://Pango?version=1.0";

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

function MediaPlayer({ player }: { player: AstalMpris.Player }) {
    const { START, END } = Gtk.Align;
    const playerIcon = "audio-x-generic-symbolic";

    return (
        <box
            cssClasses={["media-player"]}
            // css={bind(player, "coverArt").as(c =>
            //     `background-image: radial-gradient(circle, rgba(0,0,0, 0.75) 10%, rgba(0,0,0, 0.75)), url("${c}");`)}
            visible={bind(player, "playback_status").as((status) => status != AstalMpris.PlaybackStatus.STOPPED)}
            orientation={Gtk.Orientation.VERTICAL}
        >
            <box cssClasses={["title"]}>
                <label
                    ellipsize={Pango.EllipsizeMode.END}
                    hexpand={true}
                    halign={START}
                    label={bind(player, "title")}
                    maxWidthChars={36}
                />
                <image iconName={playerIcon} />
            </box>
            <label
                halign={START}
                valign={START}
                wrap={true}
                label={bind(player, "artist")}
                ellipsize={Pango.EllipsizeMode.END}
                maxWidthChars={20}
            />
            <slider
                visible={bind(player, "length").as(l => l > 0)}
                // onDragged={({ value }) => player.position = value * player.length} TODO
                value={bind(player, "position").as(p => player.length > 0 ? p / player.length : 0)}
            />
            <centerbox
                cssClasses={["actions"]}
            >
                <label
                    hexpand={true}
                    cssClasses={["position"]}
                    halign={START}
                    visible={bind(player, "length").as(l => l > 0)}
                    label={bind(player, "position").as(lengthStr)}
                />
                <box>
                    <button
                        $clicked={() => player.previous()}
                        visible={bind(player, "canGoPrevious")}
                    >
                        <image iconName="media-skip-backward-symbolic" />
                    </button>
                    <button
                        $clicked={() => player.play_pause()}
                        visible={bind(player, "canControl")}
                    >
                        <image iconName={bind(player, "playbackStatus").as(s => s === AstalMpris.PlaybackStatus.PLAYING ? "media-playback-pause-symbolic" : "media-playback-start-symbolic" )} />
                    </button>
                    <button
                        $clicked={() => player.next()}
                        visible={bind(player, "canGoNext")}
                    >
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
    );
}

export default () => {
    const mpris = AstalMpris.get_default();

    return (
        <box
            orientation={Gtk.Orientation.VERTICAL}
        >
            <For each={bind(mpris, "players")}>
                {(player) => {
                    return <MediaPlayer player={player} />
                }}
            </For>
        </box>
    );
}
