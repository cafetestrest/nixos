import { bind, Variable } from "astal"
import { Gtk } from "astal/gtk3"
import Mpris from "gi://AstalMpris"
import icons from "../../../lib/icons"

export default () => {
    const mpris = Mpris.get_default()
    const revealMedia = Variable(true);

    const truncateString = (str: string, maxLength: number = 40): string => {
        if (!str) {
            return str;
        }
        return str.length > maxLength ? str.slice(0, maxLength) : str;
    };

    return (
        <box className={"Media"}>
            {bind(mpris, "players").as(ps => ps[0] ? (
                <box
                    visible={bind(ps[0], "playback_status").as((status) => status != Mpris.PlaybackStatus.STOPPED)}
                >
                    <button
                        onClicked={() => revealMedia.set(!revealMedia.get())}
                        className={"bar-button"}
                    >
                        <box
                            className={"Cover"}
                            valign={Gtk.Align.CENTER}
                            css={bind(ps[0], "coverArt").as(cover =>
                                `background-image: url('${cover}');`
                            )}
                        />
                    </button>

                    <revealer
                        className={"media-revealer"}
                        revealChild={bind(revealMedia)}
                        visible={bind(revealMedia)}
                    >
                        <box>
                            <button
                                onClicked={() => ps[0].play_pause()}
                                className={"bar-button"}
                            >
                                <box>
                                    <label
                                        label={bind(ps[0], "metadata").as(() => {
                                            return `${truncateString(ps[0].title)}   ${truncateString(ps[0].artist, 20)}`
                                        })}
                                    />
                                </box>
                            </button>
                        </box>
                    </revealer>
                    <button
                        onClicked={() => ps[0].previous()}
                        visible={bind(ps[0], "canGoPrevious")}
                        className={"bar-button"}
                    >
                        <icon icon={icons.media.goprev} />
                    </button>
                    <button
                        onClicked={() => ps[0].play_pause()}
                        className={"bar-button"}
                    >
                        <icon icon={bind(ps[0], "playbackStatus").as((status) =>
                            status === Mpris.PlaybackStatus.PLAYING ? icons.media.playing : icons.media.stopped
                        )} />
                    </button>
                    <button
                        onClicked={() => ps[0].next()}
                        visible={bind(ps[0], "canGoNext")}
                        className={"bar-button"}
                    >
                        <icon icon={icons.media.gonext} />
                    </button>
                </box>
            ) : (
                <box visible={false} />
            ))}
        </box>
    );
}
