import { enableBarSystemIndicators, visibleQSMainPage, setVisibleQSMainPage } from "../../common/Variables";
import SystemIndicators from "./SystemIndicators";

export default () => {
    if (enableBarSystemIndicators === false) {
        return (
            <box visible={false} />
        );
    }

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
