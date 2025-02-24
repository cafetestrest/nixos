import { bind } from "astal";
import { Gdk } from "astal/gtk4";
import { visiblePowermenu, commandOpenStartupApps } from "../../common/Variables";
import icons from "../../../lib/icons";
import { bash } from "../../../lib/utils";

export default () => {
    return (
        <button
    		cssClasses={bind(visiblePowermenu).as((v) => {
                if (v) {
                    return ["powermenu-button", "bar-button", "active"];
                }
                return ["powermenu-button", "bar-button"];
            })}
            onButtonPressed={(_, event: Gdk.ButtonEvent) => {
                switch (event.get_button()) {
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
    			<image iconName={icons.powermenu.shutdown} />
            </box>
        </button>
    );
}
