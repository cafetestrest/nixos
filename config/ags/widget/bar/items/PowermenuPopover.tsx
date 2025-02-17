import PopoverCenter from "../../popovers/PopoverCenter";
import { visiblePowermenu } from "../../common/Variables";
import Powermenu from "../../powermenu/Powermenu";

export default () => {
    return (
        <PopoverCenter
            name={"powermenu"}
            namespace={"powermenu"}
            className={"Popup"}
            onClose={() => visiblePowermenu.set(false)}
            visible={visiblePowermenu()}
        >
            <box className={"popup"} vertical={true}>
                {/* maxWidthChars is needed, wrap will work as intended */}
                <Powermenu onClicked={() => visiblePowermenu.set(false)} />
            </box>
        </PopoverCenter>
    );
}
