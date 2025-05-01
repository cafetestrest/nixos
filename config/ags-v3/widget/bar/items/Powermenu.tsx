import icons from "../../../lib/icons";
import PowermenuButtons from "../../powermenu/PowermenuButtons";

export default () => {
    return (
        <menubutton>
            <image
                cssClasses={["powermenu", "bar-button"]}
                iconName={icons.powermenu.shutdown}
            />
            <popover>
                <PowermenuButtons/>
            </popover>
        </menubutton>
    );
}
