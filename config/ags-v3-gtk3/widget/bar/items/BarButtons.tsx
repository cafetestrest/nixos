import NoteButton from "./NoteButton";
import ScreenshotButton from "./ScreenshotButton";
import ColorPickerButton from "./ColorPickerButton";
import { enableBarButtons } from "../../common/Variables";

export default () => {
    if (!enableBarButtons) {
        return (<box visible={false} />);
    }

    return (
        <box class={"bar-buttons"}>
            <NoteButton />
            <ScreenshotButton />
            <ColorPickerButton />
        </box>
    );
}
