import { Astal, Gdk, Gtk } from "ags/gtk3";
import App from "ags/gtk3/app";
import { timeout } from "ags/time";
import Brightness from "../../service/BrightnessService";
import Wp from "gi://AstalWp";
import { osdLevelbarWidth, hasBrightness } from "../common/Variables";
import { createState, Setter, Accessor } from "ags";

function OnScreenProgress({ visible, setVisible }: { visible:Accessor<boolean>, setVisible: Setter<boolean> }) {
    let brightness = null;

    if (hasBrightness) {
        brightness = Brightness.get_default()
    }

    const speaker = Wp.get_default()!.get_default_speaker()

    const [iconName, setIconName] = createState("")
    const [value, setValue] = createState(0)

    let firstStart = true;
    let count = 0
    function show(v: number, icon: string) {
        setVisible(true)
        setValue(v)
        setIconName(icon)
        count++
        timeout(2000, () => {
            count--
            if (count === 0) setVisible(false)
        })
    }

    return (
        <revealer
            $={(self) => {
                if (brightness) {
                    brightness.connect("notify::screen", () =>
                        show(brightness.screen, "display-brightness-symbolic"),
                    )
                }

                if (speaker) {
                    speaker.connect("notify::volume", () => {
                        if (firstStart) {
                            firstStart = false;
                            return;
                        }

                        show(speaker.volume, speaker.volumeIcon);
                    })
                }
            }}
            revealChild={visible}
            transitionType={Gtk.RevealerTransitionType.SLIDE_UP}
        >
            <box class={"osd-box"} vertical={true}>
                <icon icon={iconName} class={iconName.as((icon) => {
                    if (icon === "audio-volume-muted-symbolic") {
                        return "osd-icon muted";
                    }
                    return "osd-icon";
                })} valign={Gtk.Align.CENTER} vexpand={true}/>
                <levelbar valign={Gtk.Align.CENTER} widthRequest={osdLevelbarWidth} value={value}/>
            </box>
        </revealer>
    )
}

export default function OSD(monitor: Gdk.Monitor) {
    const [visible, setVisible] = createState(false)

    return (
        <window
            gdkmonitor={monitor}
            class={"osd"}
            namespace={"osd"}
            name={"osd"}
            application={App}
            layer={Astal.Layer.OVERLAY}
            keymode={Astal.Keymode.ON_DEMAND}
        >
            <eventbox onClick={() => setVisible(false)}>
                <OnScreenProgress visible={visible} setVisible={setVisible} />
            </eventbox>
        </window>
    )
}
