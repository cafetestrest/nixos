import icons from "../../../lib/icons";
import { bind } from "ags/state";
import { qsRevealScreenshot } from "../../../lib/config";
import { Gtk } from "ags/gtk4";
import { config } from "../../../lib/config";
import { execAsync } from "ags/process";

export default () => {
    return (
        <revealer
            transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
            revealChild={bind(qsRevealScreenshot)}
        >
            <box
                cssClasses={["qs-menu"]}
                spacing={config.quickSettings.menuSpacing}
                orientation={Gtk.Orientation.VERTICAL}
            >
                <label
                    label={"Screenshot Menu"}
                    cssClasses={["qs-menu-label"]}
                />
                <box
                    cssClasses={["qs-menu-content"]}
                    spacing={config.quickSettings.menuSpacing}
                    orientation={Gtk.Orientation.VERTICAL}
                >
                    <button
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
                    </button>
                </box>
            </box>
        </revealer>
    );
}
