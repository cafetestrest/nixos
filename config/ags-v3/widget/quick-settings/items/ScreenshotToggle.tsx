import icons from "../../../lib/icons";
import QSToggleBlueprint from "../items/QSToggleBlueprint";
import { qsRevealScreenshot, setQsRevealScreenshot } from "../../../lib/config";

export default () => {
    return (
        <QSToggleBlueprint
            className={qsRevealScreenshot.as((a) => a ? ["toggles", "control-center-button", "active"] : ["toggles", "control-center-button", "inactive"])}
            icon={icons.screenshot}
            label={"Screenshot"}
            clicked={() => {
                setQsRevealScreenshot(!qsRevealScreenshot)
            }}
            arrowIcon={qsRevealScreenshot.as(a => a ? icons.ui.arrow.down : icons.ui.arrow.right)}
        />
    );
}
