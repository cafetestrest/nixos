import icons from "../../../lib/icons";
import QSToggleBlueprint from "../items/QSToggleBlueprint";
import { qsRevealScreenRecord, setQsRevealScreenRecord } from "../../../lib/config";

export default () => {
    return (
        <QSToggleBlueprint
            className={qsRevealScreenRecord((a) => a ? ["toggles", "control-center-button", "active"] : ["toggles", "control-center-button", "screenrec"])}
            icon={icons.record}
            label={"Screen record"}
            clicked={() => {
                setQsRevealScreenRecord(!qsRevealScreenRecord)
            }}
            arrowIcon={qsRevealScreenRecord(a => a ? icons.ui.arrow.down : icons.ui.arrow.right)}
        />
    );
}
