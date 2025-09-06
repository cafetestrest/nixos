import {
    qsRevealScreenshot,
    config
} from "../../../lib/config";
import icons from "../../../lib/icons";
import { bash } from "../../../lib/utils";
import { Gtk } from "ags/gtk3";

const ScreenShotMenu = () => {
    return (
        <box
            vertical={true}
            spacing={config.qs.qsRevealScreenshotSpacing}
        >
            <label
                label={"Screenshot Menu"}
                class={"qs-menu-label"}
            />
            <box
                vertical={true}
                spacing={config.qs.qsRevealScreenshotSpacing}
                class={"qs-menu-content"}
            >
                <button
                    onClicked={() => {
    					bash(config.common.commandScreenshotWholeDisplay)
                    }}
                >
                    <box>
                        <icon
                            icon={icons.screenshot}
                        />
                        <label
                            label={"Full display"}
                        />
                    </box>
                </button>

                <button
                    onClicked={() => {
    					bash(config.common.commandScreenshotSelectRegion)
                    }}
                >
                    <box>
                        <icon
                            icon={icons.select}
                        />
                        <label
                            label={"Select region"}
                        />
                    </box>
                </button>

                <button
                    onClicked={() => {
    					bash(config.common.commandScreenshotSelectWindow)
                    }}
                >
                    <box>
                        <icon
                            icon={icons.window}
                        />
                        <label
                            label={"Select window"}
                        />
                    </box>
                </button>
            </box>
        </box>
    );
};

export default () => {
    return (
        <revealer
            transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
            revealChild={qsRevealScreenshot}
        >
            <box class={`menu screenshot`} vertical={true} >
				<ScreenShotMenu />
            </box>
        </revealer>
    );
}
