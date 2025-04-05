import { App, Astal, Gdk } from "astal/gtk3";
import { hook } from "astal";
import {
    overviewBoxTopMargin,
    overviewContentWidth,
    overviewWidth,
    namespaceOverview,
    workspaces
} from "../common/Variables";
// import Overview from "./Overview";
import { range } from "../../lib/utils";
import Workspace from "./Workspace";
import AstalHyprland from "gi://AstalHyprland?version=0.1";

export function hideOverview() {
    App.get_window(namespaceOverview)!.hide()
}

const Hyprland = AstalHyprland.get_default();

const Overview = () => (
	<box
		className={namespaceOverview}
		children={range(workspaces).map(Workspace)}
        setup={(self) => {
            self.hook(Hyprland, "event", () => self.children.map((btn) => {
              btn.visible = Hyprland.workspaces.some(ws => {
                if (ws.id < workspaces)
                  return ws.id +1 >= btn.attribute

                return ws.id >= btn.attribute
              });
            }));
        }}
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
