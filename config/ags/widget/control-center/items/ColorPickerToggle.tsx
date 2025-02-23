import { timeout } from "astal";
import icons from "../../../lib/icons";
import QSToggle from "./QSToggle";
import { bash } from "../../../lib/utils";
import { visibleQSMainPage, commandColorPicker } from "../../common/Variables";

export default () => {
    return (
        <QSToggle
            className={"toggles control-center-button"}
            onPrimaryClick={() => {
                visibleQSMainPage.set(false);

                timeout(500, () => {
                    bash(commandColorPicker)
                });
            }}
            icon={icons.ui.colorpicker}
            label={"Colorpicker"}
            hasArrow={false}
        />
    );
}
