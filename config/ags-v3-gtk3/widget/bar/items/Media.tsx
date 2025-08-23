import { Gtk } from "ags/gtk3";
import Mpris from "gi://AstalMpris";
import icons from "../../../lib/icons";
import { enableBarMediaIndicator } from "../../common/Variables";
import { createBinding, createState, For } from "ags";
import AstalMpris from "gi://AstalMpris?version=0.1";

export default () => {
    if (enableBarMediaIndicator === false) {
        return (
            <box visible={false} />
        );
    }

    const mpris = Mpris.get_default()
    const [revealMedia, setRevealMedia] = createState(true);

    const truncateString = (str: string, maxLength: number = 40): string => {
        if (!str) {
            return str;
        }
        return str.length > maxLength ? str.slice(0, maxLength) : str;
    };

    return (
        <box class={"media"}>
            <For each={createBinding(mpris, "players")}>
                {(player: AstalMpris.Player) =>
                <box
                    visible={createBinding(player, "playback_status").as((status) => status != Mpris.PlaybackStatus.STOPPED)}
                >
                    <button
                        onClicked={() => setRevealMedia(!revealMedia.get())}
                        class={"bar-button"}
                    >
                        <box
                            class={"cover"}
                            valign={Gtk.Align.CENTER}
                            css={createBinding(player, "coverArt").as(cover =>
                                `background-image: url('${cover}');`
                            )}
                        />
                    </button>

                    <revealer
                        class={"media-revealer"}
                        revealChild={revealMedia}
                        visible={revealMedia}
                    >
                        <box>
                            <button
                                onClicked={() => player.play_pause()}
                                class={"bar-button"}
                            >
                                <box>
                                    <label
                                        label={createBinding(player, "metadata").as(() => {
                                            return `${truncateString(player.title)}   ${truncateString(player.artist, 20)}`
                                        })}
                                    />
                                </box>
                            </button>
                        </box>
                    </revealer>
                    <button
                        onClicked={() => player.previous()}
                        visible={createBinding(player, "canGoPrevious")}
                        class={"bar-button"}
                    >
                        <icon icon={icons.media.goprev} />
                    </button>
                    <button
                        onClicked={() => player.play_pause()}
                        class={"bar-button"}
                    >
                        <icon icon={createBinding(player, "playbackStatus").as((status) =>
                            status === Mpris.PlaybackStatus.PLAYING ? icons.media.playing : icons.media.stopped
                        )} />
                    </button>
                    <button
                        onClicked={() => player.next()}
                        visible={createBinding(player, "canGoNext")}
                        class={"bar-button"}
                    >
                        <icon icon={icons.media.gonext} />
                    </button>
                </box>
                }
            </For>
        </box>
    );
}
