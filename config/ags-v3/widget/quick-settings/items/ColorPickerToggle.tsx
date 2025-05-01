import { execAsync } from "ags/process";
import icons from "../../../lib/icons";
import QSToggleBlueprint from "../items/QSToggleBlueprint";
import { timeout } from "ags/time";
import { qsPopupActive } from "../../bar/items/SystemIndicators";

export default () => {
    return (
        <QSToggleBlueprint
            className={"color-picker"}
            icon={icons.ui.colorpicker}
            label={"Colorpicker"}
            clicked={() => {
                qsPopupActive.set(false);

                // timeout(500, () => {
                //     execAsync(["bash", "-c", "hyprpicker -a"])
                //         .then((out) => console.log(out))
                //         .catch((err) => console.error(err))
                // })
            }}
        />
    );
}
