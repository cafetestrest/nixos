import { Astal, Gdk } from "ags/gtk3";
import App from "ags/gtk3/app";
import Calendar from "./calendar/Calendar";
import {
    dashboardWidth,
    setDashboardWidth,
    config
} from "../../lib/config";

function hide() {
    App.get_window(config.dashboard.namespace)!.hide()
}

export default function Dashboard() {
    return <window
        name={config.dashboard.namespace}
        namespace={config.dashboard.namespace}
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM}
        exclusivity={Astal.Exclusivity.IGNORE}
        keymode={Astal.Keymode.ON_DEMAND}
        application={App}
        visible={false}
        onShow={(self) => {
            setDashboardWidth(self.get_current_monitor().workarea.width)
        }}
        onKeyPressEvent={function (self, e) {
            const event = e as unknown as Gdk.Event;
            if (event.get_keyval()[1] === Gdk.KEY_Escape)
                self.hide()
        }}>
        <box class={"popover"}>
            <eventbox widthRequest={dashboardWidth(w => w / 2)} expand={true} onClick={hide} />
            <box hexpand={false} vertical={true}>
                <eventbox heightRequest={config.dashboard.boxTopMargin} onClick={hide} />
                <box widthRequest={config.dashboard.contentWidth} class={"popup-box"} vertical={true}>
                    <Calendar />
                </box>
                <eventbox expand={true} onClick={hide} />
            </box>
            <eventbox widthRequest={dashboardWidth(w => w / 2)} expand={true} onClick={hide} />
        </box>
    </window>
}
