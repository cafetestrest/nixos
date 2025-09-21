import { Gtk } from "ags/gtk3";
import QSMainPage from "./pages/QSMainPage";
import QSBluetoothPage from "./pages/QSBluetoothPage";
// import QSNetworkPage from "./pages/QSNetworkPage";
import { qsPage } from "../../lib/config";

export default () => {
    const controlCenterPages = [
        <QSMainPage />,
        <QSBluetoothPage />,
        {/* <QSNetworkPage /> */}
    ];

    return (
        <box class={"quick-settings"} vertical={true}>
            <stack
                visibleChildName={qsPage}
                transitionType={Gtk.StackTransitionType.SLIDE_LEFT_RIGHT}
                children={controlCenterPages as Gtk.Widget[]}
            >
            </stack>
        </box>
    );
};
