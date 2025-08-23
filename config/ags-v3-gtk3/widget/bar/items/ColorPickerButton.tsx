import { bash } from "../../../lib/utils";
import icons from "../../../lib/icons";
import { commandColorPicker } from "../../common/Variables";

export default () => {
    return <button
        onClicked={() => {
            bash(commandColorPicker)
        }}
        class={"color-picker-button bar-button"}
    >
        <icon icon={icons.ui.colorpicker}/>
    </button>
}
