import { Astal, Gdk, Gtk, Widget } from "astal/gtk4";
import { isQSRevealerOpen, qsRevertRevealerStatus, qsPage } from "../common/Variables";

const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor

type PopoverProps = Pick<
    Widget.WindowProps,
    | "name"
    | "namespace"
    | "cssClasses"
    | "visible"
    | "child"
    | "marginBottom"
    | "marginTop"
    | "marginLeft"
    | "marginRight"
    | "halign"
    | "valign"
> & {
    onClose?(self: Astal.Window): void
}

/**
 * Full screen window widget where you can space the child widget
 * using margins and alignment properties.
 *
 * NOTE: Child widgets will assume they can span across the full window width
 * this means that setting `wrap` or `ellipsize` on labels for example will not work
 * without explicitly setting its `max_width_chars` property.
 * For a workaround see PopoverCenter.tsx
 */
export default function Popover({
    child,
    marginBottom,
    marginTop,
    marginLeft,
    marginRight,
    halign = Gtk.Align.CENTER,
    valign = Gtk.Align.CENTER,
    className,
    onClose,
    ...props
}: PopoverProps) {
    return (
        <window
            cssClasses={["popover", `${className}`]}
            {...props}
            keymode={Astal.Keymode.EXCLUSIVE}
            anchor={TOP | BOTTOM | LEFT | RIGHT}
            exclusivity={Astal.Exclusivity.IGNORE}
            onNotifyVisible={(self) => {
                if (!self.visible) onClose?.(self)
            }}
            // close when click occurs otside of child
            onButtonPressed={(self, event: Gdk.ButtonEvent) => {
                const [, _x, _y] = event.get_position()
                const { x, y, width, height } = self
                    .get_child()!
                    .get_allocation()

                const xOut = _x < x || _x > x + width
                const yOut = _y < y || _y > y + height

                // clicked outside
                if (xOut || yOut) {
                    self.visible = false
                }
            }}
            // close when hitting Escape
            onKeyPressed={(self, keyval: number) => {
                if (keyval === Gdk.KEY_Escape) {
                    return;
                }

                if (self.name !== "quicksettings") {
                    self.visible = false;
                    return;
                }

                if (qsPage.get() !== "main") {
                    qsPage.set("main");
                    return;
                }

                if (isQSRevealerOpen()) {
                    qsRevertRevealerStatus("");
                    return;
                }

                self.visible = false;
            }}
        >
            <box
                // make sure click event does not bubble up
                onButtonPressed={() => true}
                // child can be positioned with `halign` `valign` and margins
                hexpand={true}
                vexpand={true}
                halign={halign}
                valign={valign}
                marginBottom={marginBottom}
                marginTop={marginTop}
                marginStart={marginLeft}
                marginEnd={marginRight}
            >
                {child}
            </box>
        </window>
    )
}
