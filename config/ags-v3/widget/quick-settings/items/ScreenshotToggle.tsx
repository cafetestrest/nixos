import icons from "../../../lib/icons";
import QSToggleBlueprint from "../items/QSToggleBlueprint";
import { bind } from "ags/state";
import { qsRevealScreenshot } from "../../../lib/config";

export default () => {
    const active = bind(qsRevealScreenshot);

    return (
        <QSToggleBlueprint
            className={active.as((a) => a ? ["toggles", "control-center-button", "active"] : ["toggles", "control-center-button", "inactive"])}
            icon={icons.screenshot}
            label={"Screenshot"}
            clicked={() => {
                qsRevealScreenshot.set(!qsRevealScreenshot.get())
            }}
            arrowIcon={active.as(a => a ? icons.ui.arrow.down : icons.ui.arrow.right)}
        />
    );
}
