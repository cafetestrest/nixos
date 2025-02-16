import { bind } from "astal"
import icons from "../../../lib/icons";
import QSToggle from "./QSToggle";
import { qsRevealScreenshot } from "../../common/Variables";

export default () => {
    return (
        <QSToggle
            className={bind(qsRevealScreenshot).as((p) => {
                if (p) {
                    return "toggles control-center-button active";
                }
                return "toggles control-center-button";
            })}
            onPrimaryClick={() => qsRevealScreenshot.set(!qsRevealScreenshot.get())}
            icon={icons.screenshot}
            label={"Screenshot"}
            hasArrow={true}
            revelaer="screenshot"
        />
    );
}
