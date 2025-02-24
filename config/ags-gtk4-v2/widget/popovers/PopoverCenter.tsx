import { Astal, Gdk, Widget } from "astal/gtk4";
import Variable from "astal/variable";

type PopoverProps = Pick<
    Widget.WindowProps,
    | "name"
    | "namespace"
    | "cssClasses"
    | "visible"
    | "child"
> & {
    onClose?(self: Astal.Window): void
}

/**
 * Full screen window where the child is positioned to center.
 *
 * NOTE: Workaround for the label wrap issue by padding the window
 * with eventboxes and only anchoring to TOP | BOTTOM.
 */
export default function Popover({
    child,
    onClose,
    ...props
}: PopoverProps) {
    let win: Astal.Window;

    const width = Variable(1000)
    const hide = () => (win.visible = false)

    return (
        <window
            {...props}
            setup={self => win = self}
            keymode={Astal.Keymode.EXCLUSIVE}
            anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM}
            exclusivity={Astal.Exclusivity.IGNORE}
            onNotifyVisible={(self) => {
                // instead of anchoring to all sides we set the width explicitly
                // otherwise label wrapping won't work correctly without setting their width
                if (self.visible) {
                    width.set(3840)
                    // width.set(self.get_current_monitor().workarea.width)//todo
                } else {
                    onClose?.(self)
                }
            }}
            // close when hitting Escape
            onKeyPressed={(self, keyval: number) => {
                if (keyval === Gdk.KEY_Escape) {
                    self.visible = false
                }
            }}
        >
            <box>
                <box widthRequest={width(w => w / 2)} hexpand={true} vexpand={true} onButtonPressed={hide} />
                <box hexpand={false} vertical={true}>
                    <box hexpand={true} vexpand={true} onButtonPressed={hide} />
                    {child}
                    <box hexpand={true} vexpand={true} onButtonPressed={hide} />
                </box>
                <box widthRequest={width(w => w / 2)} hexpand={true} vexpand={true} onButtonPressed={hide} />
            </box>
        </window>
    )
}
