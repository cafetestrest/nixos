import { bind } from "astal";
import Tray from "gi://AstalTray";
import { enableBarSysTray } from "../../common/Variables";

export default () => {
    if (enableBarSysTray === false) {
        return (
            <box visible={false} />
        );
    }

    const tray = Tray.get_default()

    return (
        <box className={"SysTray"}>
            {bind(tray, "items").as(items => items.map(item => (
                <menubutton
                    className={"bar-button"}
                    tooltipMarkup={bind(item, "tooltipMarkup")}
                    usePopover={false}
                    actionGroup={bind(item, "actionGroup").as(ag => ["dbusmenu", ag])}
                    menuModel={bind(item, "menuModel")}>
                    <icon gicon={bind(item, "gicon")} />
                </menubutton>
            )))}
        </box>
    );
}
