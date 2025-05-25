import GLib from "gi://GLib";
import { readFileAsync } from "ags/file";
import { fileExists } from "./utils";
import { State } from "ags/state";

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
    | "MediaPlayer"

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

export type QuickSettingsToggleWidgets =
    | "bluetoothToggle"
    | "networkToggle"
    | "noteToggle"
    | "nightLightToggle"
    | "idleToggle"
    | "microphoneToggle"
    | "dndToggle"
    | "screenshotToggle"
    | "colorPickerToggle"
    | "screenrecordToggle"
    | "emptyToggle"

export type QuickSettingsWidgets =
    | "QSToggles"
    | "AudioSliderBox"
    | "BrightnessSliderBox"
    | "SinkMenu"
    | "WeatherSchedule"
    | "MediaPlayer"

interface Config {
    applauncher: Applauncher;
    bar: Bar;
    barLayout: BarLayout;
    common: Common;
    hyprland: Hyprland;
    // usage: Usage;
    // qs: QS;
    // weather: Weather;
    screenRecord: ScreenRecord;
    // dashboard: Dashboard;
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
    weather: Weather;
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

interface Common {
    commandOpenNote: string; // command to open note.md file (Open Note tile or bar button)
    commandSelectRegion: string; // command to select region for screenshot
    commandStartScreenRecord: string; // command to start screen recording
    commandColorPicker: string; // command to open color picker
    commandOpenStartupApps: string; // command to open startup apps (pre-defined layout of apps)
    commandScreenshotWholeDisplay: string; // command to take whole screen screenshot
    commandScreenshotSelectRegion: string; // command to take selected region screenshot
    commandScreenshotSelectWindow: string; // command to take selected window screenshot
    commandGetLightstripIp: string; // command to retrieve new ip for lightstrip
    commandTurnOnLightstrip: string; // command to turn on lightstrip
    commandTurnOffLightstrip: string; // command to turn off lightstrip
}

interface Hyprland {
    enabled: boolean, // enable / disable hyprland widgets
    numberOfWorkspaces: number, // number of workspaces to be rendered
}

interface Powermenu {
    layout: PowermenuWidgets[], // layout of icons and commands that will appear on powermenu popup
    lockCommand: string, // command used to lock PC
    sleepCommand: string, // command used to put PC to sleep
    logoutCommand: string, // command used to log-out current account from PC
    rebootCommand: string, // command used to restart PC
    shutdownCommand: string, // command used to power off PC
}

interface ScreenRecord {
    recordInternalAudioToggle: boolean; // used to control internal audio toggle state
    recordOnlySelectedScreenToggle: boolean; // used to control record selected area toggle state
    recordSaveDateFormat: string; // file name to make it unique (date format)
    recordScreenrecordsDir: string; // screenrecord save directory
    recordScreenshotsDir: string; // screenshot save directory
}

interface Substitutions {
    icons: Record<string, string>; // icons used to substitute strings if they cannot be found from hyprland classname
    titles: Record<string, string>; // titles used to substitute strings if they cannot be found
}

interface SystemIndicators {
    layout: SysIndicatorWidgets[], // layout of system indicators icons in bar
}

interface QuickSettings {
    rowsPerPage: number, // qs widget rows per page
    rowSpacing: number, // qs spacing between row widgets
    pageSpacing: number, // qs spacing between page widgets
    menuSpacing: number, // qs spacing of menu widgets
    sliderSpacing: number, // qs spacing of slider boxes (audio, brightness)
    qsLayoutMarginSpacing: number; // qs spacing marginTop and marginBottom spacing for widget layout
    marginTop: number, // qs window margin top
    marginRight: number, // qs window margin right
    layout: QuickSettingsWidgets[], // qs widget layout
    togglesLayout: QuickSettingsToggleWidgets[][], // qs toggles widget layout
}

interface Weather {
    days: number; // number of days rendered in weather widget
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
            // "Mpris",
            "Taskbar",
            "Workspaces",
        ],
        startRight: [
            "MediaPlayer",
        ],
        center: [
            "Clock",
        ],
        endLeft: [],
        endRight: [
            "BluetoothPowerUsage",
            "Tray",
            // "Wireless",
            // "Battery",
            "SystemIndicators",
            "Powermenu",
        ],
    },
    common: {
        commandOpenNote: "codium ~/Documents/note.md",
        commandSelectRegion: "slurp",
        commandStartScreenRecord: "wf-recorder -c h264_vaapi -f",
        commandColorPicker: "hyprpicker -a",
        commandOpenStartupApps: "openstartupapps",
        commandScreenshotWholeDisplay: "screenshot",
        commandScreenshotSelectRegion: "screenshot 1",
        commandScreenshotSelectWindow: "screenshot 2",
        commandGetLightstripIp: "getyeelightip",
        commandTurnOnLightstrip: `~/.config/scripts/yeelight/yeelight-scene.sh 0 On`,
        commandTurnOffLightstrip: `~/.config/scripts/yeelight/yeelight-scene.sh 0 Off`,
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
    screenRecord: {
        recordInternalAudioToggle: false,
        recordOnlySelectedScreenToggle: false,
        recordSaveDateFormat: "%Y-%m-%d_%H-%M-%S",
        recordScreenrecordsDir: "/Videos/Screenrecords",
        recordScreenshotsDir: "/Pictures/Screenshots",
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
        rowsPerPage: 3,
        rowSpacing: 4,
        pageSpacing: 4,
        menuSpacing: 16,
        sliderSpacing: 4,
        qsLayoutMarginSpacing: 1,
        marginTop: 38,
        marginRight: 12,
        layout: [
            "QSToggles",
            "AudioSliderBox",
            "BrightnessSliderBox",
            "SinkMenu",
            "WeatherSchedule",
            "MediaPlayer",
        ],
        togglesLayout: [
            ["bluetoothToggle", "nightLightToggle"],
            ["idleToggle", "microphoneToggle"],
            ["dndToggle", "screenshotToggle"],
            ["networkToggle", "screenrecordToggle"],
            ["colorPickerToggle", "noteToggle"],
        ],
    },
    weather: {
        days: 5,
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
	const configFileOverride = GLib.get_user_config_dir() + `/.ags-override/config.jsosn`; // todo rename TO config.json

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

export const qsPopupActive = new State(false);
export const qsRevealSinksButton = new State<boolean>(false);
export const qsRevealScreenshot = new State<boolean>(false);
export const qsRevealScreenRecord = new State<boolean>(false);
export const qsRevealWifi = new State<boolean>(false);
export const qsRevealBluetooth = new State<boolean>(false);
export const recordInternalAudioToggle = new State<boolean>(config.screenRecord.recordInternalAudioToggle);
export const recordOnlySelectedScreenToggle = new State<boolean>(config.screenRecord.recordOnlySelectedScreenToggle);
