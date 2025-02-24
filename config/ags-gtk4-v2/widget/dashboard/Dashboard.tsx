import { App, Astal, Gdk } from "astal/gtk4";
import Calendar from "./calendar/Calendar";
import {
    dashboardBoxTopMargin,
    dashboardContentWidth,
    dashboardWidth,
    namespaceDashboard
} from "../common/Variables";

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
        onKeyPressed={(_, keyval: number) => {
            if (keyval === Gdk.KEY_Escape)
                hide()
        }}>
        <box cssClasses={["Popup"]}>
            <box widthRequest={dashboardWidth(w => w / 2)} hexpand={true} vexpand={true} onClick={hide} />
            <box hexpand={false} vertical={true}>
                <box heightRequest={dashboardBoxTopMargin} onClick={hide} />
                <box widthRequest={dashboardContentWidth} cssClasses={["popup-box"]} vertical={true}>
                    <Calendar />
                </box>
                <box hexpand={true} vexpand={true} onClick={hide} />
            </box>
            <box widthRequest={dashboardWidth(w => w / 2)} hexpand={true} vexpand={true} onClick={hide} />
        </box>
    </window>
}
