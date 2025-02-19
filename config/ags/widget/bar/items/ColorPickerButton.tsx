import { bash } from "../../../lib/utils";
import icons from "../../../lib/icons";

export default () => {
    return <button
        onClicked={() => {
            bash('hyprpicker -a')
        }}
        className={"color-picker-button bar-button"}
    >
        <icon icon={icons.ui.colorpicker}/>
    </button>
}
