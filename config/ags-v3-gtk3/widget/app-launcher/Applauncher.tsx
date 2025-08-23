import Apps from "gi://AstalApps";
import { Astal, Gdk, Gtk } from "ags/gtk3";
import {
    applauncherWidth,
    setApplauncherWidth,
    applauncherBoxTopMargin,
    applauncherContentWidth,
    applauncherScrollableHeight,
    applauncherSingleItemHeight,
    namespaceApplauncher
} from "../common/Variables";
import icons from "../../lib/icons";
import { containsMathOperation } from "./Math";
import { MathResult } from "./MathResult";
import { createState, For } from "ags";
import App from "ags/gtk3/app";

function hide() {
    App.get_window(namespaceApplauncher)!.hide()
}

function AppButton({ app }: { app: Apps.Application }) {
    return <button
        class={"app-button"}
        onClicked={() => { hide(); app.launch() }}>
        <box class={"app-button-content"}>
            <icon icon={app.iconName} />
            <box valign={Gtk.Align.CENTER} vertical={true}>
                <label
                    class={"name"}
                    truncate={true}
                    xalign={0}
                    label={app.name}
                />
                {app.description && <label
                    class={"description"}
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

    const [text, setText] = createState("")
    const list = text(text => apps.fuzzy_query(text).sort((a, b) => a.name.localeCompare(b.name)));
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


    return <window
        name={namespaceApplauncher}
        namespace={"app-launcher"}
        anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM}
        exclusivity={Astal.Exclusivity.IGNORE}
        keymode={Astal.Keymode.ON_DEMAND}
        application={App}
        visible={false}
        onShow={(self) => {
            setText("")
            setApplauncherWidth(self.get_current_monitor().workarea.width)
        }}
        onKeyPressEvent={function (self, e) {
            const event = e as unknown as Gdk.Event;
            if (event.get_keyval()[1] === Gdk.KEY_Escape)
                self.hide()
        }}>
        <box>
            <eventbox widthRequest={applauncherWidth(w => w / 2)} expand={true} onClick={hide} />
            <box hexpand={false} vertical={true}>
                <eventbox heightRequest={applauncherBoxTopMargin} onClick={hide} />
                <box widthRequest={applauncherContentWidth} class={"app-launcher"} vertical={true}>
                    <box class={"app-launcher-header"}>
                        <icon
                            icon={icons.apps.search}
                        />
                        <entry
                            // $={(ref) => (text = ref)}
                            placeholderText="Search"
                            text={text}
                            // todo check if onNotifyText is correct
                            onNotifyText={self => {
                                setText(self.text)
                                if (!self.text) {
                                    self.grab_focus();
                                }
                            }}
                            onActivate={onEnter}
                            hexpand={true}
                        />
                    </box>
                    <scrollable
                        heightRequest={list.as((l) => {
                            return Math.min(l.length * applauncherSingleItemHeight, applauncherScrollableHeight);
                        })}
                        visible={list.as((l) => l.length > 0 ? true : false)}
                        class={"app-launcher-scrollable"}
                    >
                        <box spacing={6} vertical={true} hexpand={true}>
                            <For each={list}>
                                {(app) => <AppButton app={app} />}
                            </For>
                        </box>
                    </scrollable>
                    <box
                        halign={Gtk.Align.CENTER}
                        visible={text.as(text => {
                            if (containsMathOperation(text)) {
                                return true;
                            }
                            return false;
                        })}
                    >
                        <For each={listMath}>
                            {(text) => MathResult(text)}
                        </For>
                    </box>
                </box>
                <eventbox expand={true} onClick={hide} />
            </box>
            <eventbox widthRequest={applauncherWidth(w => w / 2)} expand={true} onClick={hide} />
        </box>
    </window>
}
