import icons from "../../../lib/icons";
import QSToggle from "./QSToggle";
import { qsRevealLightstrip, setQsRevealLightstrip } from "../../common/Variables";

export default () => {
    return (
        <QSToggle
            className={qsRevealLightstrip.as((p) => {
                if (p) {
                    return "toggles control-center-button active";
                }
                return "toggles control-center-button";
            })}
            onPrimaryClick={() => setQsRevealLightstrip(!qsRevealLightstrip.get())}
            icon={icons.brightness.indicator}
            label={"Lightstrip"}
            hasArrow={true}
            arrowIcon={qsRevealLightstrip.as((p) => {
                if (p) {
                    return icons.ui.arrow.down;
                }
                return icons.ui.arrow.right;
            })}
            revelaer="lightstrip"
        />
    );
}
