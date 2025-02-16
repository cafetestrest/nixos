import Apps from "gi://AstalApps"
import { App, Astal, Gdk, Gtk } from "astal/gtk3"
import { Variable, bind } from "astal"
import {
    applauncherWidth,
    applauncherBoxTopMargin,
    applauncherContentWidth,
    applauncherScrollableHeight,
    applauncherSingleItemHeight,
    namespaceApplauncher
} from "../common/Variables"
import icons from "../../lib/icons"
import { containsMathOperation } from "./Math"
import { MathResult } from "./MathResult"

function hide() {
    App.get_window(namespaceApplauncher)!.hide()
}

function AppButton({ app }: { app: Apps.Application }) {
    return <button
        className={"AppButton"}
        onClicked={() => { hide(); app.launch() }}>
        <box className={"app-button-content"}>
            <icon icon={app.iconName} />
            <box valign={Gtk.Align.CENTER} vertical>
                <label
                    className={"name"}
                    truncate
                    xalign={0}
                    label={app.name}
                />
                {app.description && <label
                    className={"description"}
                    wrap
                    xalign={0}
                    label={app.description}
                />}
            </box>
        </box>
    </button>
}

export default function Applauncher() {
    const apps = new Apps.Apps()

    const text = Variable("")
    const list = text(text => apps.fuzzy_query(text));
    const listMath = text(text => text);

    const onEnter = () => {
        if (containsMathOperation(text.get())) {
            hide();
            return;
        }

        apps.fuzzy_query(text.get())?.[0].launch()
        hide()
    }

    const items = bind(list);

    return <window
        name={namespaceApplauncher}
        namespace={"app-launcher"}
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM}
        exclusivity={Astal.Exclusivity.IGNORE}
        keymode={Astal.Keymode.ON_DEMAND}
        application={App}
        visible={false}
        onShow={(self) => {
            text.set("")
            applauncherWidth.set(self.get_current_monitor().workarea.width)
        }}
        onKeyPressEvent={function (self, event: Gdk.Event) {
            if (event.get_keyval()[1] === Gdk.KEY_Escape)
                self.hide()
        }}>
        <box>
            <eventbox widthRequest={applauncherWidth(w => w / 2)} expand onClick={hide} />
            <box hexpand={false} vertical>
                <eventbox heightRequest={applauncherBoxTopMargin} onClick={hide} />
                <box widthRequest={applauncherContentWidth} className={"Applauncher"} vertical>
                    <box className={"app-launcher-header"}>
                        <icon
                            icon={icons.apps.search}
                        />
                        <entry
                            placeholderText="Search"
                            text={text()}
                            onChanged={self => text.set(self.text)}
                            onActivate={onEnter}
                            hexpand
                        />
                    </box>
                    <scrollable
                        heightRequest={items.as((l) => {
                            return Math.min(l.length * applauncherSingleItemHeight, applauncherScrollableHeight);
                        })}
                        visible={items.as((l) => l.length > 0 ? true : false)}
                        className={"app-launcher-scrollable"}
                    >
                        <box spacing={6} vertical hexpand>
                            {list.as(list => list.map(app => (
                                <AppButton app={app} />
                            )))}
                        </box>
                    </scrollable>
                    <box
                        halign={Gtk.Align.CENTER}
                        visible={bind(text).as(text => {
                            if (containsMathOperation(text)) {
                                return true;
                            }
                            return false;
                        })}
                    >
                        {listMath.as(text => MathResult(text))}
                    </box>
                </box>
                <eventbox expand onClick={hide} />
            </box>
            <eventbox widthRequest={applauncherWidth(w => w / 2)} expand onClick={hide} />
        </box>
    </window>
}
