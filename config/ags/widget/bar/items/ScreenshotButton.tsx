import { Astal, Gdk } from "astal/gtk3";
import { bash } from "../../../lib/utils";
import icons from "../../../lib/icons";
import {
    commandScreenshotSelectRegion,
    commandScreenshotWholeDisplay,
    commandScreenshotSelectWindow
} from "../../common/Variables";

export default () => {
    return <button
        onClickRelease={(_, event: Astal.ClickEvent) => {
            switch (event.button) {
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
        className={"screenshot-button bar-button"}
    >
        <icon icon={icons.screenshot}/>
    </button>
}
