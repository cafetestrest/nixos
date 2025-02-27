import { GLib } from "astal";
import { Gtk, Astal } from "astal/gtk4";
import Notifd from "gi://AstalNotifd";
import icons from "../../lib/icons";
import Pango from "gi://Pango";
import { notificationContentHeight, notificationPopupMaxWidthChars } from "../common/Variables";

const isIcon = (icon: string) =>
    !!Gtk.Image.lookup_icon(icon)

const fileExists = (path: string) =>
    GLib.file_test(path, GLib.FileTest.EXISTS)

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
    setup(self: Astal.Box): void
    onHoverLeave(self: Astal.Box): void
    notification: Notifd.Notification
}

type NotificationIconProps = {
	notification: Notifd.Notification;
};

const isImage = (image: string) => {
    if (fileExists(image)) {
        return true;
    }

    // if (isIcon(image)) {
    //     return true;
    // }//todo

    return false;
};

const NotificationIcon = ({ notification }: NotificationIconProps) => {
    const image = notification.image;
    const { CENTER } = Gtk.Align

    if (image && isImage(image)) {
        return (
            <box
                halign={CENTER}
                valign={CENTER}
                cssClasses={["notification-image"]}
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
                halign={CENTER}
                valign={CENTER}
                cssClasses={["notification-icon"]}
                css={`
                    background-image: url("file://${icon}");
                `}
            />
        );
    }

    icon = icons.fallback.notification;

    return (
        <box
            halign={CENTER}
            valign={CENTER}
        >
            <image
                cssClasses={["notification-icon"]}
                iconName={icon}
            />
        </box>
    );
};

export default function Notification(props: Props) {
    const { notification: n, onHoverLeave, setup } = props
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

    return <box
        cssClasses={["Notification", `${urgency(n)}`]}
        setup={setup}
        onHoverLeave={onHoverLeave}>
        <box vertical={true} cssClasses={["notification-box"]}>
            <box>
                <NotificationIcon notification={n} />

                <box vertical={true} heightRequest={notificationContentHeight}>
                    <box cssClasses={["header"]}>
                        {n.image && (n.appIcon || n.desktopEntry) && <image
                            cssClasses={["app-icon"]}
                            visible={Boolean(n.appIcon || n.desktopEntry)}
                            iconName={n.appIcon || n.desktopEntry}
                        />}
                        {/* <label
                            cssClasses={["app-name"]}
                            halign={START}
                            ellipsize={Pango.EllipsizeMode.END}
                            label={getAppName(n.appName || "Unknown")}
                        /> */}
                        <label
                            cssClasses={["summary"]}
                            halign={START}
                            xalign={0}
                            label={n.summary}
                            ellipsize={Pango.EllipsizeMode.END}
                        />
                        <label
                            cssClasses={["time"]}
                            hexpand={true}
                            halign={END}
                            label={time(n.time)}
                        />
                        <button onClicked={() => n.dismiss()} cssClasses={["close-button"]}>
                            <image iconName="window-close-symbolic" />
                        </button>
                    </box>
                    {/* <Gtk.Separator visible={true} /> */}
                    <box cssClasses={["content"]} visible={n.body.length > 0}>
                        <box vertical={true}>
                            {n.body && <label
                                cssClasses={["body"]}
                                wrap={true}
                                useMarkup={true}
                                halign={START}
                                xalign={0}
                                justify={Gtk.Justification.FILL}
                                wrapMode={Pango.WrapMode.CHAR}
                                label={n.body}
                                maxWidthChars={notificationPopupMaxWidthChars}
                            />}
                        </box>
                    </box>
                </box>
            </box>
            {n.get_actions().length > 0 && <box cssClasses={["actions"]}>
                {n.get_actions().map(({ label, id }) => (
                    <button
                        onClicked={() => n.invoke(id)}>
                        <label label={label} halign={CENTER} hexpand={true} />
                    </button>
                ))}
            </box>}
        </box>
    </box>
}
