import { execAsync } from "ags/process";
import icons from "../../../lib/icons";
import QSToggleBlueprint from "../items/QSToggleBlueprint";
import { timeout } from "ags/time";
import { qsPopupActive } from "../../bar/items/SystemIndicators";
import app from "ags/gtk4/app";

export default () => {
    return (
        <QSToggleBlueprint
            className={"color-picker"}
            icon={icons.ui.colorpicker}
            label={"Colorpicker"}
            clicked={() => {
                app.toggle_window("quicksettings"); // todo move (quicksettings) to conifg

                timeout(500, () => {
                    execAsync(["bash", "-c", "hyprpicker -a"])
                        .catch((err) => console.error(err))
                })
            }}
        />
    );
}
