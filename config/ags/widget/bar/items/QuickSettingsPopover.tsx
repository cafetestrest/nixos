import { Gtk } from "astal/gtk3";
import Popover from "../../popovers/Popover";
import { visibleQSMainPage, qsRevertRevealerStatus } from "../../common/Variables";
import ControlCenter from "../../control-center/ControlCenter";

export default () => {
    return (
        <Popover
            name={"quicksettings"}
            namespace={"control-center"}
            className={"popover"}
            onClose={() => {
                visibleQSMainPage.set(false);
                qsRevertRevealerStatus("");
            }}
            visible={visibleQSMainPage()}
            marginTop={38}
            marginRight={12}
            valign={Gtk.Align.START}
            halign={Gtk.Align.END}
        >
            <box className={"popup"} vertical={true}>
                <ControlCenter/>
            </box>
        </Popover>
    );
}
