import { bash } from "../../../lib/utils";
import icons from "../../../lib/icons";
import { commandColorPicker } from "../../common/Variables";

export default () => {
    return <button
        onClicked={() => {
            bash(commandColorPicker)
        }}
        cssClasses={["color-picker-button", "bar-button"]}
    >
        <image iconName={icons.ui.colorpicker}/>
    </button>
}
