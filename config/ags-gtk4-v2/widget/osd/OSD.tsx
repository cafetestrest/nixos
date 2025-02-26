import { App, Astal, Gdk, Gtk, hook } from "astal/gtk4";
import { timeout } from "astal/time";
import { Variable, bind } from "astal";
import Brightness from "../../service/BrightnessService";
import Wp from "gi://AstalWp";
import { osdLevelbarWidth, hasBrightness } from "../common/Variables";

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
                    hook(self, brightness, "notify::screen", () =>
                        show(brightness.screen, "display-brightness-symbolic"),
                    )
                }

                if (speaker) {
                    hook(self, speaker, "notify::volume", () => {
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
            <box cssClasses={["OSD"]} vertical={true}>
                <image iconName={iconName()} cssClasses={bind(iconName).as((icon) => {
                    if (icon === "audio-volume-muted-symbolic") {
                        return ["osd-icon", "muted"];
                    }
                    return ["osd-icon"];
                })} valign={Gtk.Align.CENTER} vexpand={true}/>
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
            cssClasses={["OSD"]}
            namespace={"osd"}
            application={App}
            layer={Astal.Layer.OVERLAY}
            keymode={Astal.Keymode.ON_DEMAND}
            visible={bind(visible)} // TODO maybe something else, as with this revealer animation does not show up
        >
            <box onButtonPressed={() => visible.set(false)}>
                <OnScreenProgress visible={visible} />
            </box>
        </window>
    )
}
