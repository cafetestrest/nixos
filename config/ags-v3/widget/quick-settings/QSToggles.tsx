import { Gtk } from "ags/gtk4";
import NoteToggle from "./items/NoteToggle";
import NightLightToggle from "./items/NightLightToggle";
import IdleToggle from "./items/IdleToggle";
import MicrophoneToggle from "./items/MicrophoneToggle";
import DNDToggle from "./items/DNDToggle";
import ColorPickerToggle from "./items/ColorPickerToggle";
import ScreenshotToggle from "./items/ScreenshotToggle";
import ScreenrecordToggle from "./items/ScreenrecordToggle";
import ScreenshotMenu from "./menu/ScreenshotMenu";
import ScreenrecordMenu from "./menu/ScreenrecordMenu";
import { config, QuickSettingsWidgets } from "../../lib/config";
import { State } from "ags/state";
import { chunk } from "../../lib/utils";

const widgetMap: Record<QuickSettingsWidgets, JSX.Element> = {
    noteToggle: NoteToggle(),
    nightLightToggle: NightLightToggle(),
    idleToggle: IdleToggle(),
    microphoneToggle: MicrophoneToggle(),
    dndToggle: DNDToggle(),
    screenshotToggle: ScreenshotToggle(),
    screenrecordToggle: ScreenrecordToggle(),
    colorPickerToggle: ColorPickerToggle(),
};

const menuWidgets: Partial<Record<QuickSettingsWidgets, JSX.Element>> = {
    screenshotToggle: ScreenshotMenu(),
    screenrecordToggle: ScreenrecordMenu(),
};

const renderQuickSettings = (layout: QuickSettingsWidgets[][], rowsPerPage: number) =>
    chunk(layout, rowsPerPage).flatMap((pageRows, pageIndex) => {
        const pageRowBoxes = pageRows.map((row) => {
            const rowWidgets = row.map(widget => widgetMap[widget] || null);
            return <box cssClasses={["qs-row"]}>{...rowWidgets}</box>;
        });

        const extraMenus = pageRows
            .flatMap(row => row.map(widget => menuWidgets[widget]))
            .filter(menu => menu != null);

        return [
            <box
                cssClasses={["qs-page"]}
                name={`page${pageIndex}`}
                _type="named"
                orientation={Gtk.Orientation.VERTICAL}
            >
                {...pageRowBoxes}
            </box>,
            ...extraMenus,
        ];
    });

export default () => {
    const visible = new State<string>("page0");
    const pages = chunk(config.quickSettings.layout, config.quickSettings.rowsPerPage);
    const totalPages = pages.length;

    return (
        <box
            orientation={Gtk.Orientation.VERTICAL}
        >
            <stack
                visibleChildName={visible()}
            >
                {renderQuickSettings(config.quickSettings.layout, config.quickSettings.rowsPerPage)}
            </stack>
            <box>
                {[...Array(totalPages).keys()].map(i =>
                    <button
                        label={String(i)}
                        $clicked={() => visible.set(`page${i}`)}
                    />
                )}
            </box>
        </box>
    );
}
