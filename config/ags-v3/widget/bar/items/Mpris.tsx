import AstalMpris from "gi://AstalMpris";
import AstalApps from "gi://AstalApps";
import { For } from "ags/gtk4";
import { bind } from "ags/state";
import Gtk from "gi://Gtk?version=4.0";

export default () => {
    const mpris = AstalMpris.get_default();
    const apps = new AstalApps.Apps();
  
    return (
      <menubutton>
        <box>
          <For each={bind(mpris, "players")}>
            {(player) => {
              const [app] = apps.exact_query(player.entry)
              return <image visible={!!app.iconName} iconName={app?.iconName} />
            }}
          </For>
        </box>
        <popover>
          <box spacing={4} orientation={Gtk.Orientation.VERTICAL}>
            <For each={bind(mpris, "players")}>
              {(player) => (
                <box spacing={4} widthRequest={200}>
                  <box overflow={Gtk.Overflow.HIDDEN} css="border-radius: 8px;">
                    <image pixelSize={64} file={bind(player, "coverArt")} />
                  </box>
                  <box
                    valign={Gtk.Align.CENTER}
                    orientation={Gtk.Orientation.VERTICAL}
                  >
                    <label xalign={0} label={bind(player, "title")} />
                    <label xalign={0} label={bind(player, "artist")} />
                  </box>
                  <box hexpand halign={Gtk.Align.END}>
                    <button
                      $clicked={() => player.previous()}
                      visible={bind(player, "canGoPrevious")}
                    >
                      <image iconName="media-seek-backward-symbolic" />
                    </button>
                    <button
                      $clicked={() => player.play_pause()}
                      visible={bind(player, "canControl")}
                    >
                      <box>
                        <image
                          iconName="media-playback-start-symbolic"
                          visible={bind(player, "playbackStatus").as(
                            (s) => s === AstalMpris.PlaybackStatus.PLAYING,
                          )}
                        />
                        <image
                          iconName="media-playback-pause-symbolic"
                          visible={bind(player, "playbackStatus").as(
                            (s) => s !== AstalMpris.PlaybackStatus.PLAYING,
                          )}
                        />
                      </box>
                    </button>
                    <button
                      $clicked={() => player.next()}
                      visible={bind(player, "canGoNext")}
                    >
                      <image iconName="media-seek-forward-symbolic" />
                    </button>
                  </box>
                </box>
              )}
            </For>
          </box>
        </popover>
      </menubutton>
    );
}
