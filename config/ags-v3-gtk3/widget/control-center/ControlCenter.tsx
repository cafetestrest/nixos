import { Gtk } from "ags/gtk3";
import QSMainPage from "./pages/QSMainPage";
import QSBluetoothPage from "./pages/QSBluetoothPage";
import QSNetworkPage from "./pages/QSNetworkPage";
import { config } from "../../lib/config";

export default () => {
    return (
        <box class={"control-center"} vertical={true}>
            <stack
                visibleChildName={config.qs.currentPage}
                transitionType={Gtk.StackTransitionType.SLIDE_LEFT_RIGHT}
            >
                <QSMainPage />
                <QSBluetoothPage />
                {/* <QSNetworkPage /> */}
            </stack>
        </box>
    );
};
