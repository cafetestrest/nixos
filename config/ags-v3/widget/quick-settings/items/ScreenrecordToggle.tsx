import icons from "../../../lib/icons";
import QSToggleBlueprint from "../items/QSToggleBlueprint";
import { bind } from "ags/state";
import { qsRevealScreenRecord } from "../../../lib/config";

export default () => {
    const active = bind(qsRevealScreenRecord);

    return (
        <QSToggleBlueprint
            className={active.as((a) => a ? ["toggles", "control-center-button", "active"] : ["toggles", "control-center-button", "screenrec"])}
            icon={icons.record}
            label={"Screen record"}
            clicked={() => {
                qsRevealScreenRecord.set(!qsRevealScreenRecord.get())
            }}
            arrowIcon={active.as(a => a ? icons.ui.arrow.down : icons.ui.arrow.right)}
        />
    );
}
