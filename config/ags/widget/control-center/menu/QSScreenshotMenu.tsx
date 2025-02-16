import { qsRevealScreenshot, qsRevealScreenshotSpacing } from "../../common/Variables";
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
                className={"qs-menu-label"}
            />
            <box
                vertical={true}
                spacing={qsRevealScreenshotSpacing}
                className={"qs-menu-content"}
            >
                <button
                    onClicked={() => {
    					bash('screenshot')
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
    					bash('screenshot 1')
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
    					bash('screenshot 2')
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
		<QSMenu
			classname="screenshot"
			bindVariable={qsRevealScreenshot}
			content={[
				<ScreenShotMenu />
			]}
		/>
	);
}
