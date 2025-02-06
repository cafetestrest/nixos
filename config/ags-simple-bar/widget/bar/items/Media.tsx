import { bind } from "astal"
import { Gtk } from "astal/gtk3"
import Mpris from "gi://AstalMpris"

export default () => {
    const mpris = Mpris.get_default()

    const truncateString = (str: string, maxLength: number = 40): string => {
        return str.length > maxLength ? str.slice(0, maxLength) : str;
    };

    return (
        <box className={"Media"}>
            {bind(mpris, "players").as(ps => ps[0] ? (
                <box>
                    <box
                        className={"Cover"}
                        valign={Gtk.Align.CENTER}
                        css={bind(ps[0], "coverArt").as(cover =>
                            `background-image: url('${cover}');`
                        )}
                    />
                    <label
                        label={bind(ps[0], "metadata").as(() => {
                            return `${truncateString(ps[0].title)} - ${truncateString(ps[0].artist, 20)}`
                        })}
                    />
                </box>
            ) : (
                <box visible={false} />
            ))}
        </box>
    );
}
