import NoteButton from "./NoteButton";
import ScreenshotButton from "./ScreenshotButton";
import ColorPickerButton from "./ColorPickerButton";
import { BarButtons } from "../../../lib/types";
import { config } from "../../../lib/config";

export default () => {
    const widgetMap: Record<BarButtons, JSX.Element> = {
        NoteButton: NoteButton(),
        ScreenshotButton: ScreenshotButton(),
        ColorPickerButton: ColorPickerButton(),
    };

    const renderWidgets = (widgetKeys: BarButtons[]) => {
        return widgetKeys.map(key => {
            const widget = widgetMap[key];
            return widget ? widget : null;
        });
    };
    return (
        <box class={"bar-buttons"}>
            {renderWidgets(config.barLayout.buttonsLayout)}
        </box>
    );
}
