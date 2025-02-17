import { App, Astal, Gdk, Gtk } from "astal/gtk3"
import { timeout } from "astal/time"
import { Variable, bind } from "astal"
import Brightness from "../../service/BrightnessService"
import Wp from "gi://AstalWp"
import { osdLevelbarWidth, hasBrightness } from "../common/Variables"

function OnScreenProgress({ visible }: { visible: Variable<boolean> }) {
    let brightness = null;

    if (hasBrightness) {
        brightness = Brightness.get_default()
    }

    const speaker = Wp.get_default()!.get_default_speaker()

    const iconName = Variable("")
    const value = Variable(0)

    let firstStart = true;
    let count = 0
    function show(v: number, icon: string) {
        visible.set(true)
        value.set(v)
        iconName.set(icon)
        count++
        timeout(2000, () => {
            count--
            if (count === 0) visible.set(false)
        })
    }

    return (
        <revealer
            setup={(self) => {
                if (brightness) {
                    self.hook(brightness, "notify::screen", () =>
                        show(brightness.screen, "display-brightness-symbolic"),
                    )
                }

                if (speaker) {
                    self.hook(speaker, "notify::volume", () => {
                        if (firstStart) {
                            firstStart = false;
                            return;
                        }

                        show(speaker.volume, speaker.volumeIcon);
                    })
                }
            }}
            revealChild={visible()}
            transitionType={Gtk.RevealerTransitionType.SLIDE_UP}
        >
            <box className={"OSD"} vertical={true}>
                <icon icon={iconName()} className={bind(iconName).as((icon) => {
                    if (icon === "audio-volume-muted-symbolic") {
                        return "osd-icon muted";
                    }
                    return "osd-icon";
                })} valign={Gtk.Align.CENTER} vexpand/>
                <levelbar valign={Gtk.Align.CENTER} widthRequest={osdLevelbarWidth} value={value()}/>
            </box>
        </revealer>
    )
}

export default function OSD(monitor: Gdk.Monitor) {
    const visible = Variable(false)

    return (
        <window
            gdkmonitor={monitor}
            className={"OSD"}
            namespace={"osd"}
            application={App}
            layer={Astal.Layer.OVERLAY}
            keymode={Astal.Keymode.ON_DEMAND}
        >
            <eventbox onClick={() => visible.set(false)}>
                <OnScreenProgress visible={visible} />
            </eventbox>
        </window>
    )
}
