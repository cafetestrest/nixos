import AstalTray from "gi://AstalTray";
import { enableBarSysTray } from "../../common/Variables";
import { createBinding, For } from "ags";
import { Gtk } from "ags/gtk3";

export default () => {
    if (enableBarSysTray === false) {
        return (
            <box visible={false} />
        );
    }

    const tray = AstalTray.get_default();
    const items = createBinding(tray, "items");

    const init = (btn: Gtk.MenuButton, item: AstalTray.TrayItem) => {
        btn.menuModel = item.menuModel
        btn.insert_action_group("dbusmenu", item.actionGroup)
        item.connect("notify::action-group", () => {
            item.about_to_show(); // fixes copyq items not showing up when copied
            btn.insert_action_group("dbusmenu", item.actionGroup)
        })
    }

    return (
        <box>
            <For each={items}>
                {(item) => (
                    <menubutton
                        $={(self) => init(self, item)}
                        class={"bar-button"}
                        usePopover={false}
                    >
                        <icon gicon={createBinding(item, "gicon")} />
                    </menubutton>
                )}
            </For>
        </box>
    );
}
