import icons from "../../../lib/icons";
import { bind } from "ags/state";
import { qsRevealScreenshot } from "../../../lib/config";
import { Gtk } from "ags/gtk4";

export default () => {
    const active = bind(qsRevealScreenshot);

    return (
        <revealer
            transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
            revealChild={active}
        >
            <box
                cssClasses={["qs-menu"]}
                orientation={Gtk.Orientation.VERTICAL}
            >
                <label
                    label={"Screenshot Menu"}
                    cssClasses={["qs-menu-label"]}
                />
                <box
                    orientation={Gtk.Orientation.VERTICAL}
                    // spacing={qsRevealScreenshotSpacing}
                    cssClasses={["qs-menu-content"]}
                >
                    <button
                        $clicked={() => {
                            // bash(commandScreenshotWholeDisplay)
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
                            // bash(commandScreenshotSelectRegion)
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
                            // bash(commandScreenshotSelectWindow)
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
