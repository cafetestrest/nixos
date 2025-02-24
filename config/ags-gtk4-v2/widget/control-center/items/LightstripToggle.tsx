import { bind } from "astal";
import icons from "../../../lib/icons";
import QSToggle from "./QSToggle";
import { qsRevealLightstrip } from "../../common/Variables";

export default () => {
    return (
        <QSToggle
            cssClasses={bind(qsRevealLightstrip).as((p) => {
                if (p) {
                    return ["toggles", "control-center-button", "active"];
                }
                return ["toggles", "control-center-button"];
            })}
            onPrimaryClick={() => qsRevealLightstrip.set(!qsRevealLightstrip.get())}
            icon={icons.brightness.indicator}
            label={"Lightstrip"}
            hasArrow={true}
            revelaer="lightstrip"
        />
    );
}
