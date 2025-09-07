import GLib from "gi://GLib"
import AstalNotifd from "gi://AstalNotifd"
import Pango from "gi://Pango"
import { Gtk } from "ags/gtk3"
import { config } from "../../lib/config";
import icons from "../../lib/icons"
import { timeout } from "ags/time"
import { isIcon } from "../../lib/utils"

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

const isImage = (image: string) => {
    if (fileExists(image)) {
        return true;
    }

    if (isIcon(image)) {
        return true;
    }

    return false;
};

const NotificationIcon = ({ notification }: NotificationProps) => {
    const image = notification.image;
    const { CENTER } = Gtk.Align

    if (image && isImage(image)) {
        return (
            <box
                expand={false}
                halign={CENTER}
                valign={CENTER}
                class={"notification-image"}
                css={`
                    background-image: url("file://${image}");
                `}
            />
        );
    }

    let icon = "";
    const { appIcon, desktopEntry } = notification;

    if (appIcon || desktopEntry) {
        icon = appIcon || desktopEntry;
    }

    if (icon && isImage(icon)) {
        return (
            <box
                expand={false}
                halign={CENTER}
                valign={CENTER}
                class={"notification-icon"}
                css={`
                    background-image: url("file://${icon}");
                `}
            />
        );
    }

    icon = icons.fallback.notification;

    return (
        <box
            class={"notification-icon"}
            expand={false}
            halign={CENTER}
            valign={CENTER}
        >
            <icon
                icon={icon}
                expand={true}
                halign={CENTER}
                valign={CENTER}
            />
        </box>
    );
};

export default function Notification({ notification: n }: NotificationProps) {
  return (
    <box
      // widthRequest={400}
      class={`notification ${urgency(n)}`}
      orientation={Gtk.Orientation.VERTICAL}
      $={(self) => {
        timeout(5000, () => self.destroy())
      }}
    >
      <box vertical={true} class={"notification-box"}>
        <box>
          <NotificationIcon notification={n} />

          <box vertical={true} heightRequest={config.notificationPopupWindow.contentHeight}>
            <box class="header">
              {n.image && (n.appIcon || isIcon(n.desktopEntry)) && (
                <icon
                  class="app-icon"
                  visible={Boolean(n.appIcon || n.desktopEntry)}
                  icon={n.appIcon || n.desktopEntry}
                />
              )}
              {/* <label
                class="app-name"
                halign={Gtk.Align.START}
                ellipsize={Pango.EllipsizeMode.END}
                label={n.appName || "Unknown"}
              /> */}
              <label
                  class="summary"
                  halign={Gtk.Align.START}
                  xalign={0}
                  label={n.summary}
                  ellipsize={Pango.EllipsizeMode.END}
                />
              <label
                class="time"
                hexpand
                halign={Gtk.Align.END}
                label={time(n.time)}
              />
              <button onClicked={() => n.dismiss()} class={"close-button"}>
                <icon icon="window-close-symbolic" />
              </button>
            </box>
            {/* <Gtk.Separator visible /> */}
            <box
              class="content"
              // visible={n.body.length > 0}
            >
              {/* {n.image && fileExists(n.image) && (
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
              )} */}
              <box orientation={Gtk.Orientation.VERTICAL}>
                {n.body && (
                  <label
                    class="body"
                    wrap
                    useMarkup
                    halign={Gtk.Align.START}
                    xalign={0}
                    justify={Gtk.Justification.FILL}
                    wrapMode={Pango.WrapMode.CHAR}
                    label={n.body}
                  />
                )}
              </box>
            </box>
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
    </box>
  )
}
