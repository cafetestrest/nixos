import Apps from "gi://AstalApps";
import { App, Astal, Gdk, Gtk } from "astal/gtk4";
import { Variable, bind } from "astal";
import {
    applauncherWidth,
    applauncherBoxTopMargin,
    applauncherContentWidth,
    applauncherScrollableHeight,
    applauncherSingleItemHeight,
    namespaceApplauncher
} from "../common/Variables";
import icons from "../../lib/icons";
import { containsMathOperation } from "./Math";
import { MathResult } from "./MathResult";
import Pango from "gi://Pango";

function hide() {
    App.get_window(namespaceApplauncher)!.hide()
}

function AppButton({ app }: { app: Apps.Application }) {
    return <button
        cssClasses={["AppButton"]}
        onClicked={() => { hide(); app.launch() }}>
        <box cssClasses={["app-button-content"]}>
            <image iconName={app.iconName} />
            <box valign={Gtk.Align.CENTER} vertical={true}>
                <label
                    cssClasses={["name"]}
                    ellipsize={Pango.EllipsizeMode.END}
                    xalign={0}
                    label={app.name}
                />
                {app.description && <label
                    cssClasses={["description"]}
                    wrap={true}
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

        try {
            apps.fuzzy_query(text.get())?.[0].launch();
            hide();
        } catch (error) {
            // do nothing
        }
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
        onKeyPressed={(_, keyval: number) => {
            if (keyval === Gdk.KEY_Escape)
                hide()
        }}>
        <box>
            <box widthRequest={applauncherWidth(w => w / 2)} hexpand={true} vexpand={true} onClick={hide} />
            <box hexpand={false} vertical={true}>
                <box heightRequest={applauncherBoxTopMargin} onClick={hide} />
                <box widthRequest={applauncherContentWidth} cssClasses={["Applauncher"]} vertical={true}>
                    <box cssClasses={["app-launcher-header"]}>
                        <image
                            iconName={icons.apps.search}
                        />
                        <entry
                            placeholderText="Search"
                            text={text()}
                            onChanged={self => text.set(self.text)}
                            onActivate={onEnter}
                            hexpand={true}
                        />
                    </box>
                    <Gtk.ScrolledWindow
                        heightRequest={items.as((l) => {
                            return Math.min(l.length * applauncherSingleItemHeight, applauncherScrollableHeight);
                        })}
                        visible={items.as((l) => l.length > 0 ? true : false)}
                        cssClasses={["app-launcher-scrollable"]}
                    >
                        <box spacing={6} vertical={true} hexpand={true}>
                            {list.as(list => list.map(app => (
                                <AppButton app={app} />
                            )))}
                        </box>
                    </Gtk.ScrolledWindow>
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
                <box hexpand={true} vexpand={true} onClick={hide} />
            </box>
            <box widthRequest={applauncherWidth(w => w / 2)} hexpand={true} vexpand={true} onClick={hide} />
        </box>
    </window>
}
