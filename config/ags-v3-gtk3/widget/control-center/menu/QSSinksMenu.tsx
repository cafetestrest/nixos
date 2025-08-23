import { qsRevealSinksButton, setQsRevealSinksButton, qsRevealSinksSpacing, qsRevertRevealerStatus, qsShowSinksRevealerButton } from "../../common/Variables";
import icons from "../../../lib/icons";
import QSMenu from "./QSMenu";
import AstalWp from "gi://AstalWp";
import { createBinding } from "ags";
import { For } from "ags";

let WireplumberService: AstalWp.Wp | null;
try {
	WireplumberService = AstalWp.get_default();
} catch (_) {
	WireplumberService = null;
}

const Audio = WireplumberService && WireplumberService.audio;

export const SinkButton = () => {
    if (qsShowSinksRevealerButton === false) {
        return (
            <box visible={false} />
        );
    }

    return (
        <button
            class={"qs-sink-button"}
            onClicked={() => {
                qsRevertRevealerStatus("sinks");
    			setQsRevealSinksButton(!qsRevealSinksButton.get())
            }}
        >
            <icon
                icon={qsRevealSinksButton.as((v) => v ? icons.ui.arrow.up : icons.ui.arrow.down)}
            />
        </button>
    );
}

const SinkMenu = () => {
	const speaker = AstalWp.get_default()?.audio.defaultSpeaker!;

    return (
        <box
            vertical={true}
            spacing={qsRevealSinksSpacing}
        >
            <label
                label={"Audio source"}
                class={"qs-menu-label"}
            />

            <For each={createBinding(Audio, "speakers")}>
                {(speaker: AstalWp.Endpoint) =>
                    <button
                        onClicked={() => {
                            speaker.set_is_default(true);
                        }}
                    >
                        <box>
                            <icon
                                icon={createBinding(speaker, "icon").as((icon) => {
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
                                })}
                            />
                            <box hexpand={true} />
                            <label
                                label={createBinding(speaker, "description").as((desc) => {
                                    if (desc.includes("HDMI Audio"))
                                        return "HDMI Audio";

                                    if (desc.includes("USB"))
                                        return "USB Audio";

                                    return desc;
                                })}
                                truncate={true}
                                maxWidthChars={40}
                            />
                            <box hexpand={true} />
                            <icon
                                visible={createBinding(speaker, "is_default")}
                                icon={icons.ui.tick}
                            />
                        </box>
                    </button>
                }
            </For>
        </box>
    );
};

export const SinkRevealer = () => {
    if (qsShowSinksRevealerButton === false) {
        return (
            <box visible={false} />
        );
    }

    return Audio && (
        <QSMenu
            classname={"sink-selector"}
            bindVariable={qsRevealSinksButton}
            content={[
                <SinkMenu />
            ]}
        />
    );
};