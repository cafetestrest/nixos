import icons from "../../../lib/icons";
import QSToggle from "./QSToggle";
import { bash } from "../../../lib/utils";
import { setVisibleQSMainPage, commandColorPicker } from "../../common/Variables";
import { timeout } from "ags/time";

export default () => {
    return (
        <QSToggle
            className={"toggles control-center-button"}
            onPrimaryClick={() => {
                setVisibleQSMainPage(false);

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
