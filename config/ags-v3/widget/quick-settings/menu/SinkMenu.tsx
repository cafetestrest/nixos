import icons from "../../../lib/icons";
import { bind } from "ags/state";
import { config, qsRevealSinksButton } from "../../../lib/config";
import { Gtk } from "ags/gtk4";
import AstalWp from "gi://AstalWp";
import { For } from "ags/gtk4"
import Pango from "gi://Pango?version=1.0";

function getProperAudioIcon(icon: string) {
    switch (icon) {
        case 'audio-headset-bluetooth':
        case 'audio-headset-analog-usb':
            return icons.audio.type.headset;
        case 'audio-card-analog-usb':
            return icons.audio.type.speaker;
        case 'audio-card-analog-pci':
            return icons.audio.volume.high;
        default:
            return icons.audio.type.card;
    }
}

function getProperAudioDescription(description: string) {
    if (description.includes("HDMI Audio"))
        return "HDMI Audio";

    if (description.includes("USB"))
        return "USB Audio";

    return description;
}

export default () => {
	const audio = AstalWp.get_default()?.audio!;

    return (
        <revealer
            transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
            revealChild={bind(qsRevealSinksButton)}
        >
            <box
                cssClasses={["qs-menu"]}
                spacing={config.quickSettings.menuSpacing}
                orientation={Gtk.Orientation.VERTICAL}
                marginBottom={config.quickSettings.sliderSpacing}
            >
                <label
                    label={"Audio source"}
                    cssClasses={["qs-menu-label"]}
                />
                <box
                    cssClasses={["qs-menu-content"]}
                    spacing={config.quickSettings.menuSpacing}
                    orientation={Gtk.Orientation.VERTICAL}
                >
                    <For each={bind(audio, "speakers")}>
                        {(speaker) => {
                            return (
                                <button
                                    $clicked={() => speaker.set_is_default(true)}
                                >
                                    <box>
                                        <image
                                            iconName={getProperAudioIcon(speaker.icon)}
                                        />
                                        <label
                                            label={getProperAudioDescription(speaker.description)}
                                            ellipsize={Pango.EllipsizeMode.END}
                                            maxWidthChars={40}
                                            hexpand={true}
                                        />
                                        <image
                                            iconName={icons.ui.tick}
                                            visible={speaker.isDefault}
                                        />
                                    </box>
                                </button>
                            );
                        }}
                    </For>
                </box>
            </box>
        </revealer>
    );
}
