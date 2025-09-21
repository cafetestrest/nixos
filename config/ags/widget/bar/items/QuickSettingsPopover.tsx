import { Gtk } from "ags/gtk3";
import Popover from "../../popovers/Popover";
import { visibleQSMainPage, setVisibleQSMainPage, qsRevertRevealerStatus } from "../../../lib/config";
import QuickSettings from "../../quick-settings/QuickSettings";

export default () => {
    return (
        <Popover
            name={"quicksettings"}
            namespace={"quick-settings"}
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
                    <QuickSettings/>
                </box>
            }
        />
    );
}
