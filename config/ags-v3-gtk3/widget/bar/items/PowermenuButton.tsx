import { Astal, Gdk } from "ags/gtk3";
import { visiblePowermenu, setVisiblePowermenu, commandOpenStartupApps, enableBarPowermenu, enableCommandOpenStartupApps } from "../../common/Variables";
import icons from "../../../lib/icons";
import { bash } from "../../../lib/utils";

export default () => {
    if (enableBarPowermenu === false) {
        return (
            <box visible={false} />
        );
    }

    return (
        <button
    		class={visiblePowermenu.as((v) => {
                if (v) {
                    return "powermenu-button bar-button active";
                }
                return "powermenu-button bar-button";
            })}
            onClickRelease={(_, event: Astal.ClickEvent) => {
                switch (event.button) {
                    case Gdk.BUTTON_PRIMARY:
                        setVisiblePowermenu(true);
                        break;
                    case Gdk.BUTTON_SECONDARY: {
                        if (enableCommandOpenStartupApps) {
                            bash(commandOpenStartupApps);
                        }
                        break;
                    }
                    case Gdk.BUTTON_MIDDLE: {
                        if (enableCommandOpenStartupApps) {
                            bash(commandOpenStartupApps);
                        }
                        break;
                    }
                }
            }}
        >
            <box>
    			<icon icon={icons.powermenu.shutdown} />
            </box>
        </button>
    );
}
