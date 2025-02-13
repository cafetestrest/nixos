import { Gtk } from "astal/gtk3";
import QSMainPage from "./pages/QSMainPage";
import QSBluetoothPage from "./pages/QSBluetoothPage";
import { qsPage } from "../common/Variables";
import QSNetworkPage from "./pages/QSNetworkPage";

export default () => {
    return (
        <box className={"control-center"} vertical>
            <stack
                visibleChildName={qsPage()}
                transitionType={Gtk.StackTransitionType.SLIDE_LEFT_RIGHT}
            >
                <QSMainPage />
                <QSBluetoothPage />
                <QSNetworkPage />
            </stack>
        </box>
    );
};
