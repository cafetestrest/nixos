import { bind, Variable } from "astal";
import { Gtk, App } from "astal/gtk4";
import Mpris from "gi://AstalMpris";
import icons from "../../../lib/icons";

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
        <box cssClasses={["Media"]}>
            {bind(mpris, "players").as(ps => ps[0] ? (
                <box
                    visible={bind(ps[0], "playback_status").as((status) => status != Mpris.PlaybackStatus.STOPPED)}
                >
                    <button
                        onClicked={() => revealMedia.set(!revealMedia.get())}
                        cssClasses={["bar-button"]}
                    >
                        <box
                            cssClasses={["Cover"]}
                            valign={Gtk.Align.CENTER}
                            setup={() => {
                                const updateColors = () => {
                                    const coverArt = ps[0].cover_art || "";
                
                                    if (!coverArt) {
                                        App.apply_css(`.Cover { background-image: none; }`);
                                        return;
                                    }
                
                                    App.apply_css(`.Cover { background-image: url("file://${coverArt}"); }`);
                                };
                
                                updateColors();

                                ps[0].connect("notify::cover-art", () => {
                                    updateColors();
                                });
                            }}
                        />
                    </button>

                    <revealer
                        cssClasses={["media-revealer"]}
                        revealChild={bind(revealMedia)}
                        visible={bind(revealMedia)}
                    >
                        <box>
                            <button
                                onClicked={() => ps[0].play_pause()}
                                cssClasses={["bar-button"]}
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
                        cssClasses={["bar-button"]}
                    >
                        <image iconName={icons.media.goprev} />
                    </button>
                    <button
                        onClicked={() => ps[0].play_pause()}
                        cssClasses={["bar-button"]}
                    >
                        <image iconName={bind(ps[0], "playbackStatus").as((status) =>
                            status === Mpris.PlaybackStatus.PLAYING ? icons.media.playing : icons.media.stopped
                        )} />
                    </button>
                    <button
                        onClicked={() => ps[0].next()}
                        visible={bind(ps[0], "canGoNext")}
                        cssClasses={["bar-button"]}
                    >
                        <image iconName={icons.media.gonext} />
                    </button>
                </box>
            ) : (
                <box visible={false} />
            ))}
        </box>
    );
}
