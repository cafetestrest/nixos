import { Gtk } from "ags/gtk4";
import NoteToggle from "./items/NoteToggle";
import NightLightToggle from "./items/NightLightToggle";
import IdleToggle from "./items/IdleToggle";
import MicrophoneToggle from "./items/MicrophoneToggle";
import DNDToggle from "./items/DNDToggle";
import ColorPickerToggle from "./items/ColorPickerToggle";
import ScreenshotToggle from "./items/ScreenshotToggle";
import ScreenshotMenu from "./menu/ScreenshotMenu";
import { config, QuickSettingsWidgets } from "../../lib/config";

const widgetMap: Record<QuickSettingsWidgets, JSX.Element> = {
    noteToggle: NoteToggle(),
    nightLightToggle: NightLightToggle(),
    idleToggle: IdleToggle(),
    microphoneToggle: MicrophoneToggle(),
    dndToggle: DNDToggle(),
    screenshotToggle: ScreenshotToggle(),
    colorPickerToggle: ColorPickerToggle(),
};

const menuWidgets: Partial<Record<QuickSettingsWidgets, JSX.Element>> = {
    screenshotToggle: ScreenshotMenu(),
};

const renderQuickSettings = (layout: QuickSettingsWidgets[][]) =>
    layout.map((row) => {
        const rowWidgets = row.map(widget => widgetMap[widget] || null);

        const extraMenus = row
            .map(widget => menuWidgets[widget])
            .filter(menu => menu != null);

        return [
            <box cssClasses={["qs-row"]} >
                {...rowWidgets}
            </box>,
            ...extraMenus,
        ];
    }).flat();

export default () => {
    return (
        <box
            orientation={Gtk.Orientation.VERTICAL}
        >
            {renderQuickSettings(config.quickSettings.layout)}
        </box>
    );
}
