import { Astal, Gdk } from "astal/gtk3";
import { bash } from "../../../lib/utils"
import icons from "../../../lib/icons"

export default () => {
    return <button
        onClickRelease={(_, event: Astal.ClickEvent) => {
            switch (event.button) {
                case Gdk.BUTTON_PRIMARY:
                    bash('screenshot 1')
                    break;
                case Gdk.BUTTON_SECONDARY:
                    bash('screenshot')
                    break;
                case Gdk.BUTTON_MIDDLE:
                    bash('screenshot 2')
                    break;
            }
        }}
        className={"screenshot-button bar-button"}
    >
        <icon icon={icons.screenshot}/>
    </button>
}
