import { Gtk } from "ags/gtk3";
import QSMainPage from "./pages/QSMainPage";
import QSBluetoothPage from "./pages/QSBluetoothPage";
import { qsPage } from "../common/Variables";
import QSNetworkPage from "./pages/QSNetworkPage";

export default () => {
    return (
        <box class={"control-center"} vertical={true}>
            <stack
                visibleChildName={qsPage}
                transitionType={Gtk.StackTransitionType.SLIDE_LEFT_RIGHT}
            >
                <QSMainPage />
                <QSBluetoothPage />
                <QSNetworkPage />
            </stack>
        </box>
    );
};
