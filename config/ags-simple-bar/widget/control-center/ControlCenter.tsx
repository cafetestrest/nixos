import { bind, Variable } from "astal"
import { App, Gtk, Astal, Gdk } from "astal/gtk3";
import QSMainPage from "./pages/QSMainPage";
import QSBluetoothPage from "./pages/QSBluetoothPage";
import { qsPage } from "../common/Variables";

export default () => {
    return (
        <box className={"control-center"} vertical>
            <stack
                visibleChildName={qsPage()}
                transitionType={Gtk.StackTransitionType.SLIDE_LEFT_RIGHT}
            >
                <QSMainPage />
                <QSBluetoothPage />
                {/* <BatteryPage /> */}
                {/* <SpeakerPage /> */}
                {/* <WifiPage /> */}
            </stack>
        </box>
    );
};
