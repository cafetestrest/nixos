import icons from "../../../lib/icons";
import QSToggle from "./QSToggle";
import { qsRevealLightstrip, setQsRevealLightstrip } from "../../../lib/config";

export default () => {
    return (
        <QSToggle
            className={qsRevealLightstrip.as((p) => {
                if (p) {
                    return "toggles quick-settings-button active";
                }
                return "toggles quick-settings-button";
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
