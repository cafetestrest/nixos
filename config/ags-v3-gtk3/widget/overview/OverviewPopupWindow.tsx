import { Astal, Gdk } from "ags/gtk3";
import App from "ags/gtk3/app";
import {
    overviewBoxTopMargin,
    overviewContentWidth,
    overviewWidth,
    setOverviewWidth,
    namespaceOverview,
    workspaces
} from "../common/Variables";
import { range } from "../../lib/utils";
import Workspace from "./Workspace";

export function hideOverview() {
    App.get_window(namespaceOverview)!.hide()
}

const Overview = () => (
	<box
		class={namespaceOverview}
		children={range(workspaces).map(Workspace)}
	/>
);

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
                <eventbox heightRequest={overviewBoxTopMargin} onClick={hideOverview} />
                <box widthRequest={overviewContentWidth} class={"popup-box"} vertical={true}>
                    <Overview />
                </box>
                <eventbox expand={true} onClick={hideOverview} />
            </box>
            <eventbox widthRequest={overviewWidth(w => w / 2)} expand={true} onClick={hideOverview} />
        </box>
    </window>
}
