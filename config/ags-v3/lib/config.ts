import GLib from "gi://GLib";
import { readFileAsync } from "ags/file";
import { fileExists } from "./utils";
import { State } from "ags/state";

interface Config {
    bar: Bar;
    barLayout: BarLayout;
    hyprland: Hyprland;
    // usage: Usage;
    // qs: QS;
    // weather: Weather;
    // screenRecord: ScreenRecord;
    // dashboard: Dashboard;
    applauncher: Applauncher;
    // notificationPopupWindow: NotificationPopupWindow;
    // overview: Overview;
    // osd: OSD;
    // wifi: Wifi;
    // brightness: Brightness;
    // common: Common;
    // themeVariables: ThemeVariables;
    // theme_dark: ThemeColors;
    // theme_light: ThemeColors;
    quickSettings: QuickSettings;
    powermenu: Powermenu;
    substitutions: Substitutions;
    systemIndicators: SystemIndicators;
}

interface Applauncher {
    enabled: boolean; // enables Applauncher window
    // namespaceApplauncher: string; // Applauncher namespace
    // applauncherWidth: number; // width for popup
    // applauncherBoxTopMargin: number; // top margin between topbar
    // applauncherContentWidth: number; // content (widget) width
    // applauncherScrollableHeight: number; // scrollable max heightRequest, used for calculation
    // applauncherSingleItemHeight: number; // height of single item, used to calculate scrollable heightRequest
}

interface Bar {
    // visiblePowermenu: boolean; // powermenu visible by default (used to control powermenu state)
    // visibleQSMainPage: boolean; // qs main page visible by default (used to control qs main page state)
    // enableBarButtons: boolean; // enables buttons in bar
    // enableBarUsage: boolean; // enables usage (cpu, ram, disk, bt %) all widgets
    // enableBarApplauncher: boolean; // enables Applauncher widget
    // applauncherIcon: string; // Applauncher widget icon (string)
    // enableBarTaskbar: boolean; // enables Taskbar widget
    // enableBarWorkspaces: boolean; // enables Workspaces widget
    // enableBarMediaIndicator: boolean; // enables Media Indicator widget
    // enableBarDateTime: boolean; // enables Date and Time widget
    dateTimeFormat: string; // date and time format
    // enableBarWeather: boolean; // enables Weather widget
    // enableBarNotifications: boolean; // enables Notifications Revealer widget
    // enableBarRecordingIndicator: boolean; // enables Recording Indicator widget
    // enableBarUsageCpu: boolean; // enables CPU % usage widget
    // enableBarUsageRam: boolean; // enables RAM GB usage widget
    // enableBarUsageDisk: boolean; // enables DISK % usage widget
    // enableBarUsageBluetooth: boolean; // enables Bluetooth % usage widget
    // enableBarSysTray: boolean; // enables SysTray widget
    // enableBarSystemIndicators: boolean; // enables System Indicators widget
    // enableBarPowermenu: boolean; // enables Powermenu widget
    // enableCommandOpenStartupApps: boolean; // enables command to open startup apps
    // barMarginTop: number; // to make topbar floating, margin-top
    // barMarginBottom: number; // to make topbar floating, margin-bottom
    // barMarginLeft: number; // to make topbar floating, margin-left
    // barMarginRight: number; // to make topbar floating, margin-right
}

interface BarLayout {
    startLeft: BarWidgets[]; // bar widgets start-left (most left)
    startRight: BarWidgets[]; // bar widgets start-right (left before center)
    center: BarWidgets[]; // bar widgets in center
    endLeft: BarWidgets[]; // bar widgets end-left (left after center)
    endRight: BarWidgets[]; // bar widgets end-right (most right)
}

interface Hyprland {
    enabled: boolean,
    numberOfWorkspaces: number,
}

export type BarWidgets =
    | "Launcher"
    | "Mpris"
    | "Taskbar"
    | "Workspaces"
    | "Clock"
    | "BluetoothPowerUsage"
    | "Tray"
    | "Wireless"
    | "Battery"
    | "SystemIndicators"
    | "Powermenu"

export type PowermenuWidgets =
    | "lock"
    | "sleep"
    | "logout"
    | "reboot"
    | "shutdown"

export type SysIndicatorWidgets =
    | "dndIndicator"
    | "idleIndicator"
    | "nightlightIndicator"
    | "powerProfileIndicator"
    | "bluetoothIndicator"
    | "wifiIndicator"
    | "wiredIndicator"
    | "micMuteIndicator"
    | "audioIndicator"

interface Powermenu {
    layout: PowermenuWidgets[], // layout of icons and commands that will appear on powermenu popup
    lockCommand: string, // command used to lock PC
    sleepCommand: string, // command used to put PC to sleep
    logoutCommand: string, // command used to log-out current account from PC
    rebootCommand: string, // command used to restart PC
    shutdownCommand: string, // command used to power off PC
}

interface Substitutions {
    icons: Record<string, string>;
    titles: Record<string, string>;
}

interface SystemIndicators {
    layout: SysIndicatorWidgets[],
}

export type QuickSettingsWidgets =
    | "noteToggle"
    | "nightLightToggle"
    | "idleToggle"
    | "microphoneToggle"
    | "dndToggle"
    | "screenshotToggle"
    | "colorPickerToggle"

interface QuickSettings {
    layout: QuickSettingsWidgets[][],
}

let configDefaults: Config = {
    applauncher: {
        enabled: true,
    },
    bar: {
        dateTimeFormat: "%a %b %e   %H:%M:%S"
    },
    barLayout: {
        startLeft: [
            "Launcher",
            "Mpris",
            "Taskbar",
            "Workspaces",
        ],
        startRight: [],
        center: [
            "Clock",
        ],
        endLeft: [],
        endRight: [
            "BluetoothPowerUsage",
            "Tray",
            "Wireless",
            "Battery",
            "SystemIndicators",
            "Powermenu",
        ],
    },
    hyprland: {
        enabled: true,
        numberOfWorkspaces: 10,
    },
    powermenu: {
        layout: [
            "lock",
            "sleep",
            "logout",
            "reboot",
            "shutdown",
        ],
        lockCommand: "idle l",
        sleepCommand: "idle s",
        logoutCommand: "hyprctl dispatch exit",
        rebootCommand: "systemctl reboot",
        shutdownCommand: "shutdown now",
    },
    substitutions: {
        icons: {
            "transmission-gtk": "transmission",
            "blueberry.py": "bluetooth",
            "de.shorsh.discord-screenaudio": "discord",
            "org.pwmt.zathura": "x-office-document",
            "code-url-handler": "visual-studio-code",
            "dev.zed.Zed": "zed",
            "": "preferences-desktop-display",
            "chromium-browser": "chromium",
            "VSCodium": "vscodium",
            "codium-url-handler": "vscodium",
            "jetbrains-phpstorm": "phpstorm",
            "org.kde.kdeconnect.app": "kdeconnect",
            ".blueman-manager-wrapped": "blueman",
            "dconf-editor": "ca.desrt.dconf-editor",
            "eog": "org.gnome.eog",
            "shotwell": "org.gnome.Shotwell",
            "evince": "org.gnome.Evince",
            "simple-scan": "org.gnome.SimpleScan",
            "geary": "org.gnome.Geary",
            "gnome-boxes": "org.gnome.Boxes",
            "seahorse": "org.gnome.seahorse.Application",
            "totem": "org.gnome.Totem",
            "gnome-connections": "org.gnome.Connections",
            "file-roller": "org.gnome.FileRoller",
            "rygel-preferences": "rygel",
            "gnome-disks": "org.gnome.DiskUtility",
            "gcm-viewer": "gnome-color-manager",
            "gnome-system-monitor": "org.gnome.SystemMonitor",
            "pavucontrol": "multimedia-volume-control",
            "XTerm": "xterm-color_48x48",
            "remote-viewer": "virt-viewer",
            "cursor-url-handler": "cursor",
        },
        titles: {
            "io.github.Rirusha.Cassette": "Cassette",
            "com.github.Aylur.ags": "AGS",
            "transmission-gtk": "Transmission",
            "com.obsproject.Studio": "OBS",
            "com.usebottles.bottles": "Bottles",
            "com.github.wwmm.easyeffects": "Easy Effects",
            "org.gnome.TextEditor": "Text Editor",
            "org.gnome.design.IconLibrary": "Icon Library",
            "blueberry.py": "Blueberry",
            "org.wezfurlong.wezterm": "Wezterm",
            "com.raggesilver.BlackBox": "BlackBox",
            "firefox": "Firefox",
            "org.gnome.Nautilus": "Files",
            "libreoffice-writer": "Writer",
            "chromium-browser": "Chromium",
            "dev.zed.Zed": "Zed",
            "org.telegram.desktop": "Telegram",
            "de.shorsh.discord-screenaudio": "Discord",
            "org.pwmt.zathura": "Zathura",
            "kitty": "Kitty",
            "code-url-handler": "VSCode",
            "": "Desktop",
        },
    },
    systemIndicators: {
        layout: [
            "dndIndicator",
            "idleIndicator",
            "nightlightIndicator",
            "powerProfileIndicator",
            "bluetoothIndicator",
            "wifiIndicator",
            "wiredIndicator",
            "micMuteIndicator",
            "audioIndicator",
        ],
    },
    quickSettings: {
        layout: [
            ["noteToggle", "nightLightToggle"],
            ["idleToggle", "microphoneToggle"],
            ["dndToggle", "screenshotToggle"],
            ["colorPickerToggle"],
        ]
    }
};

export const config: Config = configDefaults;

// Override config defaults with user's options
function overrideConfigRecursive<T extends object>(
    target: T,
    source: Partial<T>
) {
    for (const key of Object.keys(source) as (keyof T)[]) {
        const sourceVal = source[key];
        const targetVal = target[key];

        if (Array.isArray(sourceVal)) {
            target[key] = sourceVal as T[typeof key];
        } else if (
            sourceVal && typeof sourceVal === 'object' &&
            targetVal && typeof targetVal === 'object'
        ) {
            overrideConfigRecursive(targetVal, sourceVal as Partial<typeof targetVal>);
        } else {
            target[key] = sourceVal as T[typeof key];
        }
    }
}

try {
    const variablesConfigFile = "config.jsosn";
    const configDir = GLib.get_user_config_dir();
	const configFileOverride = `${configDir}/.ags-override/${variablesConfigFile}`;

    if (fileExists(configFileOverride)) {
        const configOverrideContent = await readFileAsync(configFileOverride).catch(err => print(err));
        if (configOverrideContent) {
            overrideConfigRecursive(configDefaults, JSON.parse(configOverrideContent));
            Object.assign(config, configDefaults);
            print("config", config)
        }
    }
} catch (e) {
    print("Error loading config file", e)
}

export const qsRevealScreenshot = new State<boolean>(false);
