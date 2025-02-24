import { bind } from "astal";
import { qsRevealSinksButton, qsRevealSinksSpacing, qsRevertRevealerStatus } from "../../common/Variables";
import icons from "../../../lib/icons";
import QSMenu from "./QSMenu";
import AstalWp from "gi://AstalWp";
import Pango from "gi://Pango";

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
            cssClasses={["qs-sink-button"]}
            onClicked={() => {
                qsRevertRevealerStatus("sinks");
    			qsRevealSinksButton.set(!qsRevealSinksButton.get())
            }}
        >
            <image
                iconName={bind(qsRevealSinksButton).as((v) => v ? icons.ui.arrow.up : icons.ui.arrow.down)}
            />
        </button>
    );
}

const SinkMenu = () => {
    if (!Audio) {
        return (<box visible={false}/>)
    }

    return (
        <box
            vertical={true}
            spacing={qsRevealSinksSpacing}
        >
            <label
                label={"Audio source"}
                cssClasses={["qs-menu-label"]}
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
                                <image
                                    iconName={bind(speaker, "icon").as((icon) => {
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
                                    label={bind(speaker, "description").as((desc) => {
                                        if (desc.includes("HDMI Audio"))
											return "HDMI Audio";

										if (desc.includes("USB"))
											return "USB Audio";

										return desc;
                                    })}
                                    ellipsize={Pango.EllipsizeMode.END}
                                    maxWidthChars={40}
                                />
                                <box hexpand={true} />
                                <image
                                    visible={bind(speaker, "is_default")}
                                    iconName={icons.ui.tick}
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
        classname={"sink-selector"}
        bindVariable={qsRevealSinksButton}
        content={[
            <SinkMenu />
        ]}
    />
);