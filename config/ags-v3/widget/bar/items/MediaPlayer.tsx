import AstalMpris from "gi://AstalMpris";
import { For, createState, createBinding } from "ags"
import { Gtk } from "ags/gtk4"
import icons from "../../../lib/icons";
import Gio from "gi://Gio?version=2.0";

function MediaCover({ player }: { player: AstalMpris.Player }) {
  const coverArt = createBinding(player, "coverArt").as(c => c && Gio.file_new_for_path(c));

  return (
      <Gtk.ScrolledWindow
         canFocus={false}
         cssClasses={["mediaplayer-art"]}
         widthRequest={1}
         heightRequest={1}
      >
          <Gtk.Picture
              file={coverArt} //todo add default blank image file path
              contentFit={Gtk.ContentFit.COVER}
              cssClasses={["mediaplayer-art-picture"]}
          />
      </Gtk.ScrolledWindow>
  );
}

export default () => {
    const mpris = AstalMpris.get_default();
    const revealMedia = createState<boolean>(true);

    const truncateString = (str: string, maxLength: number = 40): string => {
      if (!str) {
        return str;
      }
      return str.length > maxLength ? str.slice(0, maxLength) : str;
    };

    return (
      <box
        cssClasses={["media"]}
      >
        <For each={createBinding(mpris, "players")}>
          {(player) => (
            <box
              visible={createBinding(player, "playbackStatus").as(p => p !== AstalMpris.PlaybackStatus.STOPPED)}
            >
              <button
                onClicked={() => revealMedia.set(!revealMedia.get())}
                cssClasses={["bar-button", "bar-button-cover"]}
              >
                {/* <image
                  cssClasses={["cover"]}
                  file={bind(player, "coverArt")}
                /> */}
                <Gtk.Picture
                    file={createBinding(player, "coverArt").as(c => c && Gio.file_new_for_path(c))} //todo add default blank image file path
                    contentFit={Gtk.ContentFit.COVER}
                    cssClasses={["mediaplayer-art-picture"]}
                />
              </button>

              <revealer
                cssClasses={["media-revealer"]}
                revealChild={revealMedia()}
                visible={revealMedia()}
              >
                <button
                  onClicked={() => player.play_pause()}
                  visible={createBinding(player, "metadata").as(t => t ? true : false)}
                  cssClasses={["bar-button"]}
                >
                  <label
                    label={createBinding(player, "metadata").as(() => `${truncateString(player.title)}   ${truncateString(player.artist, 20)}`)}
                  />
                </button>
              </revealer>

              <button
                onClicked={() => player.previous()}
                visible={createBinding(player, "canGoPrevious")}
                cssClasses={["bar-button"]}
              >
                <image iconName={icons.media.goprev} />
              </button>
              <button
                onClicked={() => player.play_pause()}
                visible={createBinding(player, "canControl")}
                cssClasses={["bar-button"]}
              >
                <image iconName={createBinding(player, "playbackStatus").as(p => p === AstalMpris.PlaybackStatus.PLAYING ? icons.media.playing : icons.media.paused)} />
              </button>
              <button
                onClicked={() => player.next()}
                visible={createBinding(player, "canGoNext")}
                cssClasses={["bar-button"]}
              >
                <image iconName={icons.media.gonext} />
              </button>
            </box>
          )}
        </For>
      </box>
    );
}
