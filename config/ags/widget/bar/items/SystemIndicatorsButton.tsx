import { visibleQSMainPage, setVisibleQSMainPage } from "../../../lib/config";
import SystemIndicators from "./SystemIndicators";

export default () => {
    return (
        <SystemIndicators className={visibleQSMainPage.as((v) => {
            if (v) {
                return "system-indicators bar-button active";
            }
            return "system-indicators bar-button";
        })}
        onClicked={() => setVisibleQSMainPage(true)}
        />
    );
}
