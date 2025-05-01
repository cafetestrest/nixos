import { For } from "ags/gtk4";
import { bind } from "ags/state";
import Gtk from "gi://Gtk?version=4.0";
import AstalTray from "gi://AstalTray";

export default () => {
  const tray = AstalTray.get_default();
  const init = (btn: Gtk.MenuButton, item: AstalTray.TrayItem) => {
    btn.menuModel = item.menuModel
    btn.insert_action_group("dbusmenu", item.actionGroup)
    bind(item, "actionGroup").subscribe(btn, () => {
      btn.insert_action_group("dbusmenu", item.actionGroup)
    })
  };

  return (
    <box>
      <For each={bind(tray, "items")}>
        {(item) => (
          <menubutton $={(self) => init(self, item)}>
            <image gicon={bind(item, "gicon")} />
          </menubutton>
        )}
      </For>
    </box>
  );
}
