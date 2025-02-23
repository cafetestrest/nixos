import { bind } from "astal";
import { Astal, Gdk } from "astal/gtk3";
import { visiblePowermenu, commandOpenStartupApps } from "../../common/Variables";
import icons from "../../../lib/icons";
import { bash } from "../../../lib/utils";

export default () => {
    return (
        <button
    		className={bind(visiblePowermenu).as((v) => {
                if (v) {
                    return "powermenu-button bar-button active";
                }
                return "powermenu-button bar-button";
            })}
            onClickRelease={(_, event: Astal.ClickEvent) => {
                switch (event.button) {
                    case Gdk.BUTTON_PRIMARY:
                        visiblePowermenu.set(true);
                        break;
                    case Gdk.BUTTON_SECONDARY:
                        bash(commandOpenStartupApps);
                        break;
                    case Gdk.BUTTON_MIDDLE:
                        bash(commandOpenStartupApps);
                        break;
                }
            }}
        >
            <box>
    			<icon icon={icons.powermenu.shutdown} />
            </box>
        </button>
    );
}
