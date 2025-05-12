import AstalMpris from "gi://AstalMpris";
import AstalApps from "gi://AstalApps";
import { For } from "ags/gtk4";
import { bind, State } from "ags/state";
import icons from "../../../lib/icons";

export default () => {
    const mpris = AstalMpris.get_default();
    const revealMedia = new State<boolean>(false);

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
        <For each={bind(mpris, "players")}>
          {(player) => (
            <box
              visible={bind(player, "playbackStatus").as(p => p !== AstalMpris.PlaybackStatus.STOPPED)}
            >
              <button
                $clicked={() => revealMedia.set(!revealMedia.get())}
                cssClasses={["bar-button"]}
              >
                <box
                  cssClasses={["cover"]}
                >
                  <label label={"cover"}/>
                </box>
              </button>

              <revealer
                cssClasses={["media-revealer"]}
                revealChild={revealMedia()}
                visible={revealMedia()}
              >
                <button
                  $clicked={() => player.play_pause()}
                  visible={bind(player, "metadata").as(t => t ? true : false)}
                  cssClasses={["bar-button"]}
                >
                  <label
                    label={bind(player, "metadata").as(() => `${truncateString(player.title)}   ${truncateString(player.artist, 20)}`)}
                  />
                </button>
              </revealer>

              <button
                $clicked={() => player.previous()}
                visible={bind(player, "canGoPrevious")}
                cssClasses={["bar-button"]}
              >
                <image iconName={icons.media.goprev} />
              </button>
              <button
                $clicked={() => player.play_pause()}
                visible={bind(player, "canControl")}
                cssClasses={["bar-button"]}
              >
                <image iconName={bind(player, "playbackStatus").as(p => p === AstalMpris.PlaybackStatus.PLAYING ? icons.media.playing : icons.media.paused)} />
              </button>
              <button
                $clicked={() => player.next()}
                visible={bind(player, "canGoNext")}
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
