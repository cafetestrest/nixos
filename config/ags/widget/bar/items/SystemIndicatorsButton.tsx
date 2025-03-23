import { bind } from "astal";
import { enableBarSystemIndicators, visibleQSMainPage } from "../../common/Variables";
import SystemIndicators from "./SystemIndicators";

export default () => {
    if (enableBarSystemIndicators === false) {
        return (
            <box visible={false} />
        );
    }

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
