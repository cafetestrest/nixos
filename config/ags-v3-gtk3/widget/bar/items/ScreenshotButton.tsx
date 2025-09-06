import { Astal, Gdk } from "ags/gtk3";
import { bash } from "../../../lib/utils";
import icons from "../../../lib/icons";
import { config } from "../../../lib/config";

export default () => {
    return <button
        onClickRelease={(_, event: Astal.ClickEvent) => {
            switch (event.button) {
                case Gdk.BUTTON_PRIMARY:
                    bash(config.common.commandScreenshotSelectRegion)
                    break;
                case Gdk.BUTTON_SECONDARY:
                    bash(config.common.commandScreenshotWholeDisplay)
                    break;
                case Gdk.BUTTON_MIDDLE:
                    bash(config.common.commandScreenshotSelectWindow)
                    break;
            }
        }}
        class={"screenshot-button bar-button"}
    >
        <icon icon={icons.screenshot}/>
    </button>
}
