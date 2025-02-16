import { bash } from "../../../lib/utils"
import icons from "../../../lib/icons"

export default () => {
    return <button
        onClicked={() => bash('codium ~/Documents/note.md')}
        className={"note-button bar-button"}
    >
        <icon icon={icons.note}/>
    </button>
}
