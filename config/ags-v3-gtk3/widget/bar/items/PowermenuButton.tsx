import { Astal, Gdk } from "ags/gtk3";
import { visiblePowermenu, setVisiblePowermenu, config } from "../../../lib/config";
import icons from "../../../lib/icons";
import { bash } from "../../../lib/utils";

export default () => {
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
                        if (config.bar.enableCommandOpenStartupApps) {
                            bash(config.common.commandOpenStartupApps);
                        }
                        break;
                    }
                    case Gdk.BUTTON_MIDDLE: {
                        if (config.bar.enableCommandOpenStartupApps) {
                            bash(config.common.commandOpenStartupApps);
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
