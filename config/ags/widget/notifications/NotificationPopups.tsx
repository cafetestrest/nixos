import app from "ags/gtk3/app";
import { Astal, Gtk } from "ags/gtk3";
import AstalNotifd from "gi://AstalNotifd";
import Notification from "./Notification";
import { createBinding, For, createState, onCleanup } from "ags";

export default function NotificationPopups() {
  const monitors = createBinding(app, "monitors")
  const notifd = AstalNotifd.get_default()

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
          class={"notification-popups"}
          namespace={"notifications-popup"}
          name={"notifications-popup"}
          gdkmonitor={monitor}
          visible={notifications((ns) => ns.length > 0)}
          anchor={Astal.WindowAnchor.TOP}
        >
          <box orientation={Gtk.Orientation.VERTICAL}>
            <For each={notifications}>
              {(notification) => <Notification notification={notification} />}
            </For>
          </box>
        </window>
      )}
    </For>
  )
}
