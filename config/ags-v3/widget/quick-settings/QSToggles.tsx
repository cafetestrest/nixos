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
import { config, QuickSettingsToggleWidgets } from "../../lib/config";
import { bind, State } from "ags/state";
import { chunk } from "../../lib/utils";
import WifiToggle from "./items/WifiToggle";
import WifiMenu from "./menu/WifiMenu";

function EmptyToggle() {
    return (
        <box
            cssClasses={["toggles", "control-center-button", "emptyToggle"]}
            hexpand={true}
        />
    );
}
const widgetMap: Record<QuickSettingsToggleWidgets, JSX.Element> = {
    wifiToggle: WifiToggle(),
    noteToggle: NoteToggle(),
    nightLightToggle: NightLightToggle(),
    idleToggle: IdleToggle(),
    microphoneToggle: MicrophoneToggle(),
    dndToggle: DNDToggle(),
    screenshotToggle: ScreenshotToggle(),
    screenrecordToggle: ScreenrecordToggle(),
    colorPickerToggle: ColorPickerToggle(),
    emptyToggle: EmptyToggle(),
};

const menuWidgets: Partial<Record<QuickSettingsToggleWidgets, JSX.Element>> = {
    screenshotToggle: ScreenshotMenu(),
    screenrecordToggle: ScreenrecordMenu(),
    wifiToggle: WifiMenu(),
};

const renderQuickSettings = (
    layout: QuickSettingsToggleWidgets[][],
    rowsPerPage: number
) =>
    chunk(layout, rowsPerPage).flatMap((pageRows, pageIndex) => {
        // Build the page content row by row
        const pageContent = pageRows.flatMap((row) => {
            const rowWidgets = row.map(widget => widgetMap[widget] || null);

            const rowMenus = row
                .map(widget => menuWidgets[widget])
                .filter(menu => menu != null);

            return [
                <box
                    cssClasses={["qs-row"]}
                    spacing={config.quickSettings.rowSpacing}
                >
                    {...rowWidgets}
                </box>,
                ...rowMenus,
            ];
        });

        return [
            <box
                cssClasses={["qs-page"]}
                name={`page${pageIndex}`}
                _type="named"
                orientation={Gtk.Orientation.VERTICAL}
                spacing={config.quickSettings.pageSpacing}
            >
                {...pageContent}
            </box>
        ];
    });

export default () => {
    const visible = new State<string>("page0");
    const pages = chunk(config.quickSettings.togglesLayout, config.quickSettings.rowsPerPage);
    const totalPages = pages.length;

    return (
        <box
            orientation={Gtk.Orientation.VERTICAL}
        >
            <stack
                visibleChildName={visible()}
            >
                {renderQuickSettings(config.quickSettings.togglesLayout, config.quickSettings.rowsPerPage)}
            </stack>
            <box
                halign={Gtk.Align.CENTER}
                cssClasses={["qs-pages-box"]}
            >
                {[...Array(totalPages).keys()].map(i =>
                    <button
                        $clicked={() => visible.set(`page${i}`)}
                        valign={Gtk.Align.CENTER}
                        cssClasses={bind(visible).as(p => p === `page${i}` ? ["workspace-button", "active"] : ["workspace-button"])}
                    >
                        <box
                            cssClasses={["workspace-dot"]}
                        />
                    </button>
                )}
            </box>
        </box>
    );
}
