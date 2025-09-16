import { Gtk } from "ags/gtk3";
import Popover from "../../popovers/Popover";
import { visibleQSMainPage, setVisibleQSMainPage, qsRevertRevealerStatus } from "../../../lib/config";
import ControlCenter from "../../control-center/ControlCenter";

export default () => {
    return (
        <Popover
            name={"quicksettings"}
            namespace={"control-center"}
            className={"popover"}
            onClose={() => {
                setVisibleQSMainPage(false);
                qsRevertRevealerStatus("");
            }}
            visible={visibleQSMainPage}
            marginTop={38}
            marginRight={12}
            valign={Gtk.Align.START}
            halign={Gtk.Align.END}
            child={
                <box class={"popup"} vertical={true}>
                    <ControlCenter/>
                </box>
            }
        />
    );
}
