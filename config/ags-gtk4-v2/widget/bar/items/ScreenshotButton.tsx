import { Astal, Gdk } from "astal/gtk4";
import { bash } from "../../../lib/utils";
import icons from "../../../lib/icons";
import {
    commandScreenshotSelectRegion,
    commandScreenshotWholeDisplay,
    commandScreenshotSelectWindow
} from "../../common/Variables";

export default () => {
    return <button
        onButtonPressed={(_, event: Gdk.ButtonEvent) => {
            switch (event.get_button()) {
                case Gdk.BUTTON_PRIMARY:
                    bash(commandScreenshotSelectRegion)
                    break;
                case Gdk.BUTTON_SECONDARY:
                    bash(commandScreenshotWholeDisplay)
                    break;
                case Gdk.BUTTON_MIDDLE:
                    bash(commandScreenshotSelectWindow)
                    break;
            }
        }}
        cssClasses={["screenshot-button", "bar-button"]}
    >
        <image iconName={icons.screenshot}/>
    </button>
}
