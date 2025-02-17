import { bind } from "astal";
import { visibleQSMainPage } from "../../common/Variables";
import SystemIndicators from "./SystemIndicators";

export default () => {
    return (
        <SystemIndicators className={bind(visibleQSMainPage).as((v) => {
            if (v) {
                return "system-indicators bar-button active";
            }
            return "system-indicators bar-button";
        })}
        onClicked={() => visibleQSMainPage.set(true)}
        />
    );
}
