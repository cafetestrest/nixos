import { bash } from "../../../lib/utils";
import icons from "../../../lib/icons";
import { commandOpenNote } from "../../common/Variables";

export default () => {
    return <button
        onClicked={() => bash(commandOpenNote)}
        className={"note-button bar-button"}
    >
        <icon icon={icons.note}/>
    </button>
}
