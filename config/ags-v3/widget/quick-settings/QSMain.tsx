import Astal from "gi://Astal?version=4.0";
import Gtk from "gi://Gtk?version=4.0";
import Gdk from "gi://Gdk?version=4.0";
import Graphene from "gi://Graphene";
import QSMainLayout from "./QSMainLayout";
import { config } from "../../lib/config";

const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor;

export default () => {
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
      $={(ref) => (win = ref)}
      name="quicksettings"
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
        name="quicksettings-content"
        valign={Gtk.Align.START}
        halign={Gtk.Align.END}
        marginTop={config.quickSettings.marginTop}
        // todo add this in config (halign, valign)
        marginEnd={config.quickSettings.marginEnd}
        orientation={Gtk.Orientation.VERTICAL}
      >
        <QSMainLayout />
      </box>
    </window>
  )
}
