import icons from "../../../lib/icons";
import { bind } from "ags/state";
import { qsRevealScreenshot, qsRevealSinksButton } from "../../../lib/config";
import { Gtk } from "ags/gtk4";
import { config } from "../../../lib/config";
import { execAsync } from "ags/process";
import AstalWp from "gi://AstalWp";
import { For } from "ags/gtk4"

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
                                        <image iconName={speaker.icon === "audio-headset-bluetooth" ? icons.audio.type.headset : speaker.icon} />
                                        <label label={speaker.description}/>
                                    </box>
                                </button>
                            );
                        }}
                    </For>
                    {/* <button
                        $clicked={() => {
                            execAsync(["bash", "-c", config.common.commandScreenshotWholeDisplay])
                                .catch((err) => console.error(err));
                        }}
                    >
                        <box>
                            <image
                                iconName={icons.screenshot}
                            />
                            <label
                                label={"Full display"}
                            />
                        </box>
                    </button>

                    <button
                        $clicked={() => {
                            execAsync(["bash", "-c", config.common.commandScreenshotSelectRegion])
                                .catch((err) => console.error(err));
                        }}
                    >
                        <box>
                            <image
                                iconName={icons.select}
                            />
                            <label
                                label={"Select region"}
                            />
                        </box>
                    </button>

                    <button
                        $clicked={() => {
                            execAsync(["bash", "-c", config.common.commandScreenshotSelectWindow])
                                .catch((err) => console.error(err));
                        }}
                    >
                        <box>
                            <image
                                iconName={icons.window}
                            />
                            <label
                                label={"Select window"}
                            />
                        </box>
                    </button> */}
                </box>
            </box>
        </revealer>
    );
}
