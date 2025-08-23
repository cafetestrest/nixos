import Tray from "gi://AstalTray";
import { enableBarSysTray } from "../../common/Variables";
import { createBinding, For } from "ags";

export default () => {
    if (enableBarSysTray === false) {
        return (
            <box visible={false} />
        );
    }

    const tray = Tray.get_default();
    const items = createBinding(tray, "items");

    return (
        <box class={"systray"}>
            <For each={items}>
                {(item) => 
                    <menubutton
                        class={"bar-button"}
                        tooltipMarkup={createBinding(item, "tooltipMarkup")}
                        usePopover={false}
                        // actionGroup={createBinding(item, "actionGroup").as(ag => ["dbusmenu", ag])} //todo
                        menuModel={createBinding(item, "menuModel")}>
                        <icon gicon={createBinding(item, "gicon")} />
                    </menubutton>
                }
            </For>
        </box>
    );
}
