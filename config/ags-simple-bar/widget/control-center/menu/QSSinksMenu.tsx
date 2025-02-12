import { bind } from "astal";
import { qsRevealSinksButton, qsRevealSinksSpacing } from "../../common/Variables";
import icons from "../../../lib/icons";
import QSMenu from "./QSMenu";
import AstalWp from "gi://AstalWp";

let WireplumberService: AstalWp.Wp | null;
try {
	WireplumberService = AstalWp.get_default();
} catch (_) {
	WireplumberService = null;
}

const Audio = WireplumberService && WireplumberService.audio;

export const SinkButton = () => {
    return (
        <button
            className={"qs-sink-button"}
            onClicked={() => {
    			qsRevealSinksButton.set(!qsRevealSinksButton.get())
            }}
        >
            <icon
                icon={bind(qsRevealSinksButton).as((v) => v ? icons.ui.arrow.up : icons.ui.arrow.down)}
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
            // className={"sink-box"}
        >
            <label
                label={"Audio source"}
                className={"qs-menu-label"}
            />
            {bind(Audio, "speakers").as((speakers) => {
                return speakers.map((speaker) => {
                    return (
                        <button
                            onClicked={() => {
                                speaker.set_is_default(true);
                            }}
                        >
                            <box>
                                <icon
                                    icon={bind(speaker, "icon").as((icon) => {
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
                                <box hexpand />
                                <label
                                    label={bind(speaker, "description").as((desc) => {
                                        if (desc.includes("HDMI Audio"))
											return "HDMI Audio";

										if (desc.includes("USB"))
											return "USB Audio";

										return desc;
                                    })}
                                    truncate
                                    maxWidthChars={40}
                                />
                                <box hexpand />
                                <icon
                                    visible={bind(speaker, "is_default")}
                                    icon={icons.ui.tick}
                                />
                            </box>
                        </button>
                    );
                })
            })}
        </box>
    );
};

export const SinkRevealer = () => Audio && (
    <QSMenu
        classname="sink-selector"
        bindVariable={qsRevealSinksButton}
        content={[
            <SinkMenu />
        ]}
    />
);