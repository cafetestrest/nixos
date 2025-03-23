import { bind } from "astal";
import icons from "../../../lib/icons";
import QSToggle from "./QSToggle";
import { qsRevealLightstrip } from "../../common/Variables";

export default () => {
    return (
        <QSToggle
            className={bind(qsRevealLightstrip).as((p) => {
                if (p) {
                    return "toggles control-center-button active";
                }
                return "toggles control-center-button";
            })}
            onPrimaryClick={() => qsRevealLightstrip.set(!qsRevealLightstrip.get())}
            icon={icons.brightness.indicator}
            label={"Lightstrip"}
            hasArrow={true}
            arrowIcon={bind(qsRevealLightstrip).as((p) => {
                if (p) {
                    return icons.ui.arrow.down;
                }
                return icons.ui.arrow.right;
            })}
            revelaer="lightstrip"
        />
    );
}
