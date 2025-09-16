import { Astal, Gdk } from "ags/gtk3";
import App from "ags/gtk3/app";
import {
    overviewWidth,
    setOverviewWidth,
    config,
} from "../../lib/config";
import Workspace from "./Workspace";

export function hideOverview() {
    App.get_window(config.overview.namespace)!.hide()
}

const Overview = () => (
	<box class={config.overview.namespace}>
        <Workspace/>
    </box>
);

export default function OverviewPopupWindow() {
    return <window
        name={config.overview.namespace}
        namespace={config.overview.namespace}
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM}
        exclusivity={Astal.Exclusivity.IGNORE}
        keymode={Astal.Keymode.ON_DEMAND}
        application={App}
        visible={false}
        onShow={(self) => {
            setOverviewWidth(self.get_current_monitor().workarea.width)
        }}
        onKeyPressEvent={function (self, e) {
            const event = e as unknown as Gdk.Event;
            if (event.get_keyval()[1] === Gdk.KEY_Escape)
                self.hide()
        }}>
        <box class={"popover"}>
            <eventbox widthRequest={overviewWidth(w => w / 2)} expand={true} onClick={hideOverview} />
            <box hexpand={false} vertical={true}>
                <eventbox heightRequest={config.overview.boxTopMargin} onClick={hideOverview} />
                <box widthRequest={config.overview.contentWidth} class={"popup-box"} vertical={true}>
                    <Overview />
                </box>
                <eventbox expand={true} onClick={hideOverview} />
            </box>
            <eventbox widthRequest={overviewWidth(w => w / 2)} expand={true} onClick={hideOverview} />
        </box>
    </window>
}
