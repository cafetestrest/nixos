import { Gtk } from "astal/gtk4";
import QSMainPage from "./pages/QSMainPage";
import QSBluetoothPage from "./pages/QSBluetoothPage";
import { qsPage } from "../common/Variables";
import QSNetworkPage from "./pages/QSNetworkPage";

export default () => {
    return (
        <box cssClasses={["control-center"]} vertical={true}>
            <stack
                visibleChildName={qsPage()}
                transitionType={Gtk.StackTransitionType.SLIDE_LEFT_RIGHT}
            >
                <QSMainPage />
                {/* <QSBluetoothPage /> */}
                {/* <QSNetworkPage /> */}
            </stack>
        </box>
    );
};
