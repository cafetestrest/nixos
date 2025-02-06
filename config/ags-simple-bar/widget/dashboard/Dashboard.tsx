import { App, Astal, Gdk, Gtk } from "astal/gtk3"
import { Variable } from "astal"
import { Calendar } from "./calendar/calendar"

function hide() {
    App.get_window("dashboard")!.hide()
}

export default function Dashboard() {
    const width = Variable(1000)

    return <window
        name="dashboard"
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM}
        exclusivity={Astal.Exclusivity.IGNORE}
        keymode={Astal.Keymode.ON_DEMAND}
        application={App}
        visible={false}
        onShow={(self) => {
            width.set(self.get_current_monitor().workarea.width)
        }}
        onKeyPressEvent={function (self, event: Gdk.Event) {
            if (event.get_keyval()[1] === Gdk.KEY_Escape)
                self.hide()
        }}>
        <box className={"Popup"}>
            <eventbox widthRequest={width(w => w / 2)} expand onClick={hide} />
            <box hexpand={false} vertical>
                <eventbox heightRequest={100} onClick={hide} />
                <box widthRequest={500} className={"dashboard"} vertical>
                    <Calendar />
                </box>
                <eventbox expand onClick={hide} />
            </box>
            <eventbox widthRequest={width(w => w / 2)} expand onClick={hide} />
        </box>
    </window>
}
