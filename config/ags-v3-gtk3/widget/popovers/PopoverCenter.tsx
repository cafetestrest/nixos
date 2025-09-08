import { Astal, Gdk } from "ags/gtk3";
import { createState } from "ags";
import { PopoverCenterProps } from "../../lib/types";

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
}: PopoverCenterProps) {
    let win: Astal.Window

    const [width, setWidth] = createState(1000)
    const hide = () => (win.visible = false)

    return (
        <window
            {...props}
            $={self => win = self}
            keymode={Astal.Keymode.EXCLUSIVE}
            anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM}
            exclusivity={Astal.Exclusivity.IGNORE}
            onNotifyVisible={(self) => {
                // instead of anchoring to all sides we set the width explicitly
                // otherwise label wrapping won't work correctly without setting their width
                if (self.visible) {
                    setWidth(self.get_current_monitor().workarea.width)
                } else {
                    onClose?.(self)
                }
            }}
            // close when hitting Escape
            onKeyPressEvent={(self, e) => {
                const event = e as unknown as Gdk.Event;
                if (event.get_keyval()[1] === Gdk.KEY_Escape) {
                    self.visible = false
                }
            }}
            class={"popover"}
        >
            <box>
                <eventbox widthRequest={width(w => w / 2)} expand={true} onClick={hide} />
                <box hexpand={false} vertical={true}>
                    <eventbox expand={true} onClick={hide} />
                    {child}
                    <eventbox expand={true} onClick={hide} />
                </box>
                <eventbox widthRequest={width(w => w / 2)} expand={true} onClick={hide} />
            </box>
        </window>
    )
}
