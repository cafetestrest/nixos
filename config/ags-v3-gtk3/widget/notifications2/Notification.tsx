import GLib from "gi://GLib"
import AstalNotifd from "gi://AstalNotifd"
import Pango from "gi://Pango"
import { Astal, Gtk } from "ags/gtk3"

function isIcon(icon?: string | null) {
    return icon && !!Astal.Icon.lookup_icon(icon);
//   const iconTheme = Gtk.IconTheme.get_for_display(Gdk.Display.get_default()!)
//   return icon && iconTheme.has_icon(icon)
}

function fileExists(path: string) {
  return GLib.file_test(path, GLib.FileTest.EXISTS)
}

function time(time: number, format = "%H:%M") {
  return GLib.DateTime.new_from_unix_local(time).format(format)!
}

function urgency(n: AstalNotifd.Notification) {
  const { LOW, NORMAL, CRITICAL } = AstalNotifd.Urgency
  switch (n.urgency) {
    case LOW:
      return "low"
    case CRITICAL:
      return "critical"
    case NORMAL:
    default:
      return "normal"
  }
}

interface NotificationProps {
  notification: AstalNotifd.Notification
}

export default function Notification({ notification: n }: NotificationProps) {
  return (
    <box
    widthRequest={400}
    class={`Notification ${urgency(n)}`}
    orientation={Gtk.Orientation.VERTICAL}
    >
    <box class="header">
        {(n.appIcon || isIcon(n.desktopEntry)) && (
        <icon
            class="app-icon"
            visible={Boolean(n.appIcon || n.desktopEntry)}
            icon={n.appIcon || n.desktopEntry}
        />
        )}
        <label
        class="app-name"
        halign={Gtk.Align.START}
        ellipsize={Pango.EllipsizeMode.END}
        label={n.appName || "Unknown"}
        />
        <label
        class="time"
        hexpand
        halign={Gtk.Align.END}
        label={time(n.time)}
        />
        <button onClicked={() => n.dismiss()}>
        <icon icon="window-close-symbolic" />
        </button>
    </box>
    <Gtk.Separator visible />
    <box class="content">
        {n.image && fileExists(n.image) && (
        <icon valign={Gtk.Align.START} class="image" file={n.image} />
        )}
        {n.image && isIcon(n.image) && (
        <box valign={Gtk.Align.START} class="icon-image">
            <icon
            icon={n.image}
            halign={Gtk.Align.CENTER}
            valign={Gtk.Align.CENTER}
            />
        </box>
        )}
        <box orientation={Gtk.Orientation.VERTICAL}>
        <label
            class="summary"
            halign={Gtk.Align.START}
            xalign={0}
            label={n.summary}
            ellipsize={Pango.EllipsizeMode.END}
        />
        {n.body && (
            <label
            class="body"
            wrap
            useMarkup
            halign={Gtk.Align.START}
            xalign={0}
            justify={Gtk.Justification.FILL}
            label={n.body}
            />
        )}
        </box>
    </box>
    {n.actions.length > 0 && (
        <box class="actions">
        {n.actions.map(({ label, id }) => (
            <button hexpand onClicked={() => n.invoke(id)}>
            <label label={label} halign={Gtk.Align.CENTER} hexpand />
            </button>
        ))}
        </box>
    )}
    </box>
  )
}