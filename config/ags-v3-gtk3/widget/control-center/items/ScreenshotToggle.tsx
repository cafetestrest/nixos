import icons from "../../../lib/icons";
import QSToggle from "./QSToggle";
import { qsRevealScreenshot, setQsRevealScreenshot } from "../../common/Variables";
import { createBinding } from "ags";

export default () => {
    return (
        <QSToggle
            className={qsRevealScreenshot.as((p) => {
                if (p) {
                    return "toggles control-center-button active";
                }
                return "toggles control-center-button";
            })}
            onPrimaryClick={() => setQsRevealScreenshot(!qsRevealScreenshot.get())}
            icon={icons.screenshot}
            label={"Screenshot"}
            hasArrow={true}
            arrowIcon={qsRevealScreenshot.as((p) => {
                if (p) {
                    return icons.ui.arrow.down;
                }
                return icons.ui.arrow.right;
            })}
            revelaer="screenshot"
        />
    );
}
