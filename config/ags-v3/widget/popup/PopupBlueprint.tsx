import Astal from "gi://Astal?version=4.0";
import Gtk from "gi://Gtk?version=4.0";
import Gdk from "gi://Gdk?version=4.0";
import Graphene from "gi://Graphene";

const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor;

type PopoverProps = Pick<
  JSX.IntrinsicElements["window"],
  | "class"
  | "name"
  | "namespace"
  | "visible"
  | "marginBottom"
  | "marginTop"
  | "marginLeft"
  | "marginRight"
  | "halign"
  | "valign"
> & {
  onClose?(self: Astal.Window): void
  children: JSX.Element
}

export default ({
  children,
  marginBottom,
  marginTop,
  marginLeft,
  marginRight,
  halign = Gtk.Align.CENTER,
  valign = Gtk.Align.CENTER,
  onClose,
  ...props
}: PopoverProps) => {
  let contentbox: Gtk.Box;
  let win: Astal.Window;

  // close on ESC
  // handle alt + number key
  function onKey(
    _e: Gtk.EventControllerKey,
    keyval: number,
    _: number,
  ) {
    if (keyval === Gdk.KEY_Escape) {
      win.visible = false;
      return;
    }
  }

  // close on clickaway
  function onClick(_e: Gtk.GestureClick, _: number, x: number, y: number) {
    const [, rect] = contentbox.compute_bounds(win);
    const position = new Graphene.Point({ x, y });

    if (!rect.contains_point(position)) {
      win.visible = false;
      return true;
    }
  }

  return (
    <window
      {...props}
      $={(ref) => (win = ref)}
      anchor={TOP | BOTTOM | LEFT | RIGHT}
        // todo add anchor in config
      exclusivity={Astal.Exclusivity.IGNORE}
      keymode={Astal.Keymode.EXCLUSIVE}
    //   $$visible={({ visible }) => {
    //     if (visible) searchentry.grab_focus()
    //     else searchentry.set_text("")
    //   }}
    >
      <Gtk.EventControllerKey $key-pressed={onKey} />
      <Gtk.GestureClick $pressed={onClick} />
      <box
        $={(ref) => (contentbox = ref)}
        cssClasses={["content"]}
        valign={valign}
        halign={halign}
        marginTop={marginTop}
        marginBottom={marginBottom}
        marginStart={marginLeft}
        marginEnd={marginRight}
      >
        {children}
      </box>
    </window>
  )
}
