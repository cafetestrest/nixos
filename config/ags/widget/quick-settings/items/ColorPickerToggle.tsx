import icons from "../../../lib/icons";
import QSToggle from "./QSToggle";
import { bash } from "../../../lib/utils";
import { setVisibleQSMainPage, config } from "../../../lib/config";
import { timeout } from "ags/time";

export default () => {
    return (
        <QSToggle
            className={"toggles quick-settings-button"}
            onPrimaryClick={() => {
                setVisibleQSMainPage(false);

                timeout(500, () => {
                    bash(config.common.commandColorPicker)
                });
            }}
            icon={icons.ui.colorpicker}
            label={"Colorpicker"}
            hasArrow={false}
        />
    );
}
