import { bind } from "astal"
import Tray from "gi://AstalTray"

export default () => {
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
