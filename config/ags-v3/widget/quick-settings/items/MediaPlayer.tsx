import Gtk from "gi://Gtk?version=4.0";
import AstalMpris from "gi://AstalMpris";
import Pango from "gi://Pango?version=1.0";
import Gio from "gi://Gio?version=2.0";
import { config } from "../../../lib/config";
import { createBinding, For } from "ags";

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
    const coverArt = createBinding(player, "coverArt").as(c => c && Gio.file_new_for_path(c));

    const PlayerArt = () => (
        <Gtk.ScrolledWindow
           canFocus={false}
           cssClasses={["mediaplayer-art"]}
           heightRequest={100}
           opacity={0.3}
        >
            <Gtk.Picture
                file={coverArt} //todo add default blank image file path
                contentFit={Gtk.ContentFit.COVER}
                cssClasses={["mediaplayer-art-picture"]}
            />
        </Gtk.ScrolledWindow>
    );

    return (
        <overlay
            cssClasses={["media-player"]}
            visible={createBinding(player, "playback_status").as((status) => status != AstalMpris.PlaybackStatus.STOPPED)}
            marginTop={config.quickSettings.qsLayoutMarginSpacing}
        >
            <box
                $type="overlay"
                cssClasses={["player-content"]}
                orientation={Gtk.Orientation.VERTICAL}
            >
                <box cssClasses={["title"]}>
                    <label
                        ellipsize={Pango.EllipsizeMode.END}
                        hexpand={true}
                        halign={START}
                        label={createBinding(player, "title")}
                        maxWidthChars={36}
                    />
                    <image iconName={playerIcon} />
                </box>
                <label
                    halign={START}
                    valign={START}
                    wrap={true}
                    label={createBinding(player, "artist").as(a => a !== null ? a : "")}
                    ellipsize={Pango.EllipsizeMode.END}
                    maxWidthChars={20}
                />
                <slider
                    visible={createBinding(player, "length").as(l => l > 0)}
                    // onDragged={({ value }) => player.position = value * player.length} TODO
                    value={createBinding(player, "position").as(p => player.length > 0 ? p / player.length : 0)}
                />
                <box
                    cssClasses={["actions"]}
                >
                    <label
                        hexpand={true}
                        cssClasses={["position"]}
                        halign={START}
                        visible={createBinding(player, "length").as(l => l > 0)}
                        label={createBinding(player, "position").as(lengthStr)}
                    />
                    <box>
                        <button
                            onClicked={() => player.previous()}
                            visible={createBinding(player, "canGoPrevious")}
                        >
                            <image iconName="media-skip-backward-symbolic" />
                        </button>
                        <button
                            onClicked={() => player.play_pause()}
                            visible={createBinding(player, "canControl")}
                        >
                            <image iconName={createBinding(player, "playbackStatus").as(s => s === AstalMpris.PlaybackStatus.PLAYING ? "media-playback-pause-symbolic" : "media-playback-start-symbolic" )} />
                        </button>
                        <button
                            onClicked={() => player.next()}
                            visible={createBinding(player, "canGoNext")}
                        >
                            <image iconName="media-skip-forward-symbolic" />
                        </button>
                    </box>
                    <label
                        cssClasses={["length"]}
                        hexpand={true}
                        halign={END}
                        visible={createBinding(player, "length").as(l => l > 0)}
                        label={createBinding(player, "length").as(l => l > 0 ? lengthStr(l) : "0:00")}
                    />
                </box>
            </box>
            {coverArt && <PlayerArt/>}
        </overlay>
    );
}

export default () => {
    const mpris = AstalMpris.get_default();

    return null;//todo fix
    return (
        <box
            orientation={Gtk.Orientation.VERTICAL}
        >
            <For each={createBinding(mpris, "players")}>
                {(player) => {
                    return <MediaPlayer player={player} />
                }}
            </For>
        </box>
    );
}
