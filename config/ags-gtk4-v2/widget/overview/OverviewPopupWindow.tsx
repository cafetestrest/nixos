import { App, Astal, Gdk } from "astal/gtk4";
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
            overviewWidth.set(self.get_current_monitor().geometry.width);
        }}
        onKeyPressed={(_, keyval: number) => {
            if (keyval === Gdk.KEY_Escape)
                hideOverview()
        }}>
        <box cssClasses={["Popup"]}>
            <box widthRequest={overviewWidth(w => w / 2)} hexpand={true} vexpand={true} onButtonPressed={hideOverview} />
            <box hexpand={false} vertical={true}>
                <box heightRequest={overviewBoxTopMargin} onButtonPressed={hideOverview} />
                <box widthRequest={overviewContentWidth} cssClasses={["popup-box"]} vertical={true}>
                    <Overview />
                </box>
                <box hexpand={true} vexpand={true} onButtonPressed={hideOverview} />
            </box>
            <box widthRequest={overviewWidth(w => w / 2)} hexpand={true} vexpand={true} onButtonPressed={hideOverview} />
        </box>
    </window>
}
