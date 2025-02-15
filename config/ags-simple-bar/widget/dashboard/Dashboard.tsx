import { App, Astal, Gdk } from "astal/gtk3"
import Calendar from "./calendar/Calendar"

import { dashboardBoxTopMargin, dashboardContentWidth, dashboardWidth, namespaceDashboard } from "../common/Variables"
function hide() {
    App.get_window(namespaceDashboard)!.hide()
}

export default function Dashboard() {
    return <window
        name={namespaceDashboard}
        namespace={namespaceDashboard}
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM}
        exclusivity={Astal.Exclusivity.IGNORE}
        keymode={Astal.Keymode.ON_DEMAND}
        application={App}
        visible={false}
        onShow={(self) => {
            dashboardWidth.set(self.get_current_monitor().workarea.width)
        }}
        onKeyPressEvent={function (self, event: Gdk.Event) {
            if (event.get_keyval()[1] === Gdk.KEY_Escape)
                self.hide()
        }}>
        <box className={"Popup"}>
            <eventbox widthRequest={dashboardWidth(w => w / 2)} expand onClick={hide} />
            <box hexpand={false} vertical>
                <eventbox heightRequest={dashboardBoxTopMargin} onClick={hide} />
                <box widthRequest={dashboardContentWidth} className={"dashboard"} vertical>
                    <Calendar />
                </box>
                <eventbox expand onClick={hide} />
            </box>
            <eventbox widthRequest={dashboardWidth(w => w / 2)} expand onClick={hide} />
        </box>
    </window>
}
