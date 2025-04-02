import { App, Astal, Gdk } from "astal/gtk3";
import {
    overviewBoxTopMargin,
    overviewContentWidth,
    overviewWidth,
    namespaceOverview
} from "../common/Variables";
import Overview from "./Overview";

export function hideOverview() {
    App.get_window(namespaceOverview)!.hide()
}

export default function OverviewPopupWindow() {
    return <window
        name={namespaceOverview}
        namespace={namespaceOverview}
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM}
        exclusivity={Astal.Exclusivity.IGNORE}
        keymode={Astal.Keymode.ON_DEMAND}
        application={App}
        visible={false}
        onShow={(self) => {
            overviewWidth.set(self.get_current_monitor().workarea.width)
        }}
        onKeyPressEvent={function (self, event: Gdk.Event) {
            if (event.get_keyval()[1] === Gdk.KEY_Escape)
                self.hide()
        }}>
        <box className={"popover"}>
            <eventbox widthRequest={overviewWidth(w => w / 2)} expand={true} onClick={hideOverview} />
            <box hexpand={false} vertical={true}>
                <eventbox heightRequest={overviewBoxTopMargin} onClick={hideOverview} />
                <box widthRequest={overviewContentWidth} className={"popup-box"} vertical={true}>
                    <Overview />
                </box>
                <eventbox expand={true} onClick={hideOverview} />
            </box>
            <eventbox widthRequest={overviewWidth(w => w / 2)} expand={true} onClick={hideOverview} />
        </box>
    </window>
}
