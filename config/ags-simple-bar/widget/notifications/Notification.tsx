import { bind, GLib } from "astal"
import { Gtk, Astal } from "astal/gtk3"
import { type EventBox } from "astal/gtk3/widget"
import Notifd from "gi://AstalNotifd"
import icons from "../../lib/icons"
import Pango from "gi://Pango";
import { notificationContentHeight } from "../common/Variables"

const isIcon = (icon: string) =>
    !!Astal.Icon.lookup_icon(icon)

const fileExists = (path: string) =>
    GLib.file_test(path, GLib.FileTest.EXISTS)

const time = (time: number, format = "%H:%M") => GLib.DateTime
    .new_from_unix_local(time)
    .format(format)!

const urgency = (n: Notifd.Notification) => {
    const { LOW, NORMAL, CRITICAL } = Notifd.Urgency
    // match operator when?
    switch (n.urgency) {
        case LOW: return "low"
        case CRITICAL: return "critical"
        case NORMAL:
        default: return "normal"
    }
}

type Props = {
    setup(self: EventBox): void
    onHoverLost(self: EventBox): void
    notification: Notifd.Notification
}

type NotificationIconProps = {
	notification: Notifd.Notification;
};

const isImage = (image: string) => {
    if (fileExists(image)) {
        return true;
    }

    if (isIcon(image)) {
        return true;
    }

    return false;
};

const NotificationIcon = ({ notification }: NotificationIconProps) => {
    const image = notification.image;
    const { CENTER } = Gtk.Align

    if (image && isImage(image)) {
        return (
            <box
                expand={false}
                halign={CENTER}
                valign={CENTER}
                className={"notification-image"}
                css={`
                    background-image: url("file://${image}");
                    background-size: cover;
                    background-repeat: no-repeat;
                    background-position: center;
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
                className={"notification-icon"}
                css={`
                    background-image: url("file://${icon}");
                    background-size: cover;
                    background-repeat: no-repeat;
                    background-position: center;
                `}
            />
        );
    }

    icon = icons.fallback.notification;

    return (
        <box
            className={"notification-icon"}
            expand={false}
            halign={CENTER}
            valign={CENTER}
        >
            <icon
                icon={icon}
                expand
                halign={CENTER}
                valign={CENTER}
            />
        </box>
    );
};

export default function Notification(props: Props) {
    const { notification: n, onHoverLost, setup } = props
    const { START, CENTER, END } = Gtk.Align

    const getAppName = (appName) => {
        if (appName === "Unknown") {
            return appName;
        }

        if (appName === "notify-send") {
            return "System";
        }

        return appName;
    }

    return <eventbox
        className={`Notification ${urgency(n)}`}
        setup={setup}
        onHoverLost={onHoverLost}>
        <box vertical className={"notification-box"}>
            <box>
                <NotificationIcon notification={n} />

                <box vertical heightRequest={notificationContentHeight}>
                    <box className={"header"}>
                        {n.image && (n.appIcon || n.desktopEntry) && <icon
                            className={"app-icon"}
                            visible={Boolean(n.appIcon || n.desktopEntry)}
                            icon={n.appIcon || n.desktopEntry}
                        />}
                        {/* <label
                            className={"app-name"}
                            halign={START}
                            truncate
                            label={getAppName(n.appName || "Unknown")}
                        /> */}
                        <label
                            className={"summary"}
                            halign={START}
                            xalign={0}
                            label={n.summary}
                            truncate
                        />
                        <label
                            className={"time"}
                            hexpand
                            halign={END}
                            label={time(n.time)}
                        />
                        <button onClicked={() => n.dismiss()} className={"close-button"}>
                            <icon icon="window-close-symbolic" />
                        </button>
                    </box>
                    {/* <Gtk.Separator visible /> */}
                    <box className={"content"} visible={n.body.length > 0}>
                        <box vertical>
                            {n.body && <label
                                className={"body"}
                                wrap
                                useMarkup
                                halign={START}
                                xalign={0}
                                justifyFill
                                wrapMode={Pango.WrapMode.CHAR}
                                label={n.body}
                            />}
                        </box>
                    </box>
                </box>
            </box>
            {n.get_actions().length > 0 && <box className={"actions"}>
                {n.get_actions().map(({ label, id }) => (
                    <button
                        onClicked={() => n.invoke(id)}>
                        <label label={label} halign={CENTER} hexpand />
                    </button>
                ))}
            </box>}
        </box>
    </eventbox>
}
