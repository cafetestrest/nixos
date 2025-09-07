import app from "ags/gtk3/app"
import { Astal, Gtk, Gdk } from "ags/gtk3"
import AstalNotifd from "gi://AstalNotifd"
import Notification from "./Notification"
import { createBinding, For, createState, onCleanup } from "ags"
import {
  notificationWidth,
  setNotificationWidth,
  config
} from "../../lib/config";
import { timeout } from "ags/time"

export default function NotificationPopupWindow() {
  function hide() {
    app.get_window(config.notificationPopupWindow.namespace)!.hide()
  }

  const monitors = createBinding(app, "monitors")

  const notifd = AstalNotifd.get_default()

  if (config.notificationPopupWindow.removeAllPreviousNotificationOnStart) {
    // This will remove all existing notifications on startup
    notifd.get_notifications().forEach((n) => n.dismiss());
  }

  const [notifications, setNotifications] = createState(
    new Array<AstalNotifd.Notification>(),
  )

  const notifiedHandler = notifd.connect("notified", (_, id, replaced) => {
    const notification = notifd.get_notification(id)

    if (replaced && notifications.get().some((n) => n.id === id)) {
      setNotifications((ns) => ns.map((n) => (n.id === id ? notification : n)))
    } else {
      setNotifications((ns) => [notification, ...ns])
    }
  })

  const resolvedHandler = notifd.connect("resolved", (_, id) => {
    setNotifications((ns) => ns.filter((n) => n.id !== id))
  })

  onCleanup(() => {
    notifd.disconnect(notifiedHandler)
    notifd.disconnect(resolvedHandler)
  })

  return (
    <For each={monitors}>
      {(monitor) => (
        <window
          $={(self) => onCleanup(() => self.destroy())}
          namespace={config.notificationPopupWindow.namespace}
          name={config.notificationPopupWindow.namespace}
          gdkmonitor={monitor}
          visible={false}
          anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM}
          exclusivity={Astal.Exclusivity.IGNORE}
          keymode={Astal.Keymode.ON_DEMAND}
          application={app}
          onShow={(self) => {
            setNotificationWidth(self.get_current_monitor().workarea.width)
          }}
          onKeyPressEvent={function (self, e) {
              const event = e as unknown as Gdk.Event;
              if (event.get_keyval()[1] === Gdk.KEY_Escape)
                  self.hide()
          }}
          >
            <box class={"popover"}>
              <eventbox widthRequest={notificationWidth(w => w / 2)} expand={true} onClick={hide} />
              <box hexpand={false} vertical={true}>
                  <eventbox heightRequest={config.notificationPopupWindow.boxTopMargin} onClick={hide} />
                  <box widthRequest={config.notificationPopupWindow.contentWidth} class={"popup-box"} vertical={true}>
                    <box vertical={true} class={"notifications-window"} spacing={config.notificationPopupWindow.spacing}>
                      <box class={"notification-scroll-box"}>
                        <scrollable
                          class={"notifications-scrollable"}
                          heightRequest={notifications((n) => {
                            return Math.min(n.length * config.notificationPopupWindow.height, config.notificationPopupWindow.scrollableMaxHeight);
                          })}
                        >
                          <box
                            class={"notifications-window-list"}
                            visible={true}
                            orientation={Gtk.Orientation.VERTICAL}
                            spacing={6}
                            hexpand={true}
                          >
                            <For each={notifications}>
                              {(notifs) => <Notification notification={notifs} />}
                            </For>
                          </box>
                        </scrollable>
                      </box>
                      <button
                        halign={Gtk.Align.END}
                        hexpand={false}
                        class={"notifications-window-clear"}
                        onClicked={() => {
                          notifd.get_notifications().forEach(n => timeout(150, () => n.dismiss()));
                          hide();
                        }}
                        >
                        <label
                          class={"notifications-window-clear-label"}
                          label={"Clear all"}
                        ></label>
                      </button>
                    </box>
                  </box>
                  <eventbox expand={true} onClick={hide} />
              </box>
              <eventbox widthRequest={notificationWidth(w => w / 2)} expand={true} onClick={hide} />
          </box>
          
        </window>
      )}
    </For>
  )
}
