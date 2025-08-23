import PopoverCenter from "../../popovers/PopoverCenter";
import { visiblePowermenu, setVisiblePowermenu } from "../../common/Variables";
import Powermenu from "../../powermenu/Powermenu";

export default () => {
    return (
        <PopoverCenter
            name={"powermenu"}
            namespace={"powermenu"}
            onClose={() => setVisiblePowermenu(false)}
            visible={visiblePowermenu}
            child={
                <box class={"popup"} vertical={true}>
                    {/* maxWidthChars is needed, wrap will work as intended */}
                    <Powermenu onClicked={() => setVisiblePowermenu(false)} />
                </box>
            }
        />
    );
}
