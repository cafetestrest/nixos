import {
    qsRevealScreenshot,
    qsRevealScreenshotSpacing,
    commandScreenshotSelectRegion,
    commandScreenshotSelectWindow,
    commandScreenshotWholeDisplay
} from "../../common/Variables";
import icons from "../../../lib/icons";
import QSMenu from "./QSMenu";
import { bash } from "../../../lib/utils";

const ScreenShotMenu = () => {
    return (
        <box
            vertical={true}
            spacing={qsRevealScreenshotSpacing}
        >
            <label
                label={"Screenshot Menu"}
                cssClasses={["qs-menu-label"]}
            />
            <box
                vertical={true}
                spacing={qsRevealScreenshotSpacing}
                cssClasses={["qs-menu-content"]}
            >
                <button
                    onClicked={() => {
    					bash(commandScreenshotWholeDisplay)
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
                    onClicked={() => {
    					bash(commandScreenshotSelectRegion)
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
                    onClicked={() => {
    					bash(commandScreenshotSelectWindow)
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
    );
};

export default () => {
	return (
		<QSMenu
			classname={"screenshot"}
			bindVariable={qsRevealScreenshot}
			content={[
				<ScreenShotMenu />
			]}
		/>
	);
}
