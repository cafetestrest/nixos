import { bind } from "astal";
import Tray from "gi://AstalTray";

export default () => {
    const tray = Tray.get_default()

    return (
        <box cssClasses={["SysTray"]}>
            {bind(tray, "items").as(items => items.map(item => (
                <menubutton
                    cssClasses={["bar-button"]}
                    tooltipMarkup={bind(item, "tooltipMarkup")}
                    usePopover={false}//todo
                    actionGroup={bind(item, "actionGroup").as(ag => ["dbusmenu", ag])}
                    menuModel={bind(item, "menuModel")}>
                    <image gicon={bind(item, "gicon")} />
                </menubutton>
            )))}
        </box>
    );
}
