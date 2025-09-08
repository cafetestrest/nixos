import NoteButton from "./NoteButton";
import ScreenshotButton from "./ScreenshotButton";
import ColorPickerButton from "./ColorPickerButton";

export default () => {
    //todo layout
    return (
        <box class={"bar-buttons"}>
            <NoteButton />
            <ScreenshotButton />
            <ColorPickerButton />
        </box>
    );
}
