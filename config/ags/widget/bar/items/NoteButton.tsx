import { bash } from "../../../lib/utils";
import icons from "../../../lib/icons";
import { config } from "../../../lib/config";

export default () => {
    return <button
        onClicked={() => bash(config.common.commandOpenNote)}
        class={"note-button bar-button"}
    >
        <icon icon={icons.note}/>
    </button>
}
