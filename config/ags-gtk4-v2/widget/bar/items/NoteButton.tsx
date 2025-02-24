import { bash } from "../../../lib/utils";
import icons from "../../../lib/icons";
import { commandOpenNote } from "../../common/Variables";

export default () => {
    return <button
        onClicked={() => bash(commandOpenNote)}
        cssClasses={["note-button", "bar-button"]}
    >
        <image iconName={icons.note}/>
    </button>
}
