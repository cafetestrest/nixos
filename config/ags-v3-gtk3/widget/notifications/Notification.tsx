import { Gtk, Astal } from "ags/gtk3";
import Notifd from "gi://AstalNotifd";
import icons from "../../lib/icons";
import Pango from "gi://Pango";
import { notificationContentHeight } from "../common/Variables";
import { fileExists } from "../../lib/utils";
import GLib from "gi://GLib?version=2.0";

const isIcon = (icon: string) =>
    !!Astal.Icon.lookup_icon(icon)

const time = (time: number, format = "%H:%M") => GLib.DateTime
    .new_from_unix_local(time)
    .format(format)!

const urgency = (n: Notifd.Notification) => {
    const { LOW, NORMAL, CRITICAL } = Notifd.Urgency
    switch (n.urgency) {
        case LOW: return "low"
        case CRITICAL: return "critical"
        case NORMAL:
        default: return "normal"
    }
}

type Props = {
    setup(self): void //todo add proper prop definition
    onHoverLost(self): void//todo add proper prop definition
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
        class={`notification ${urgency(n)}`}
        $={setup}
        onHoverLost={onHoverLost}>
        <box vertical={true} class={"notification-box"}>
            <box>
                <NotificationIcon notification={n} />

                <box vertical={true} heightRequest={notificationContentHeight}>
                    <box class={"header"}>
                        {n.image && (n.appIcon || n.desktopEntry) && <icon
                            class={"app-icon"}
                            visible={Boolean(n.appIcon || n.desktopEntry)}
                            icon={n.appIcon || n.desktopEntry}
                        />}
                        {/* <label
                            class={"app-name"}
                            halign={START}
                            truncate={true}
                            label={getAppName(n.appName || "Unknown")}
                        /> */}
                        <label
                            class={"summary"}
                            halign={START}
                            xalign={0}
                            label={n.summary}
                            truncate={true}
                        />
                        <label
                            class={"time"}
                            hexpand={true}
                            halign={END}
                            label={time(n.time)}
                        />
                        <button onClicked={() => n.dismiss()} class={"close-button"}>
                            <icon icon="window-close-symbolic" />
                        </button>
                    </box>
                    {/* <Gtk.Separator visible={true} /> */}
                    <box class={"content"} visible={n.body.length > 0}>
                        <box vertical={true}>
                            {n.body && <label
                                class={"body"}
                                wrap={true}
                                useMarkup={true}
                                halign={START}
                                xalign={0}
                                justifyFill={true}
                                wrapMode={Pango.WrapMode.CHAR}
                                label={n.body}
                            />}
                        </box>
                    </box>
                </box>
            </box>
            {n.get_actions().length > 0 && <box class={"actions"}>
                {n.get_actions().map(({ label, id }) => (
                    <button
                        onClicked={() => n.invoke(id)}>
                        <label label={label} halign={CENTER} hexpand={true} />
                    </button>
                ))}
            </box>}
        </box>
    </eventbox>
}
