import { GLib, readFileAsync } from "astal";
import { fileExists, getThemeColor, ThemeMode, syncVariablesToTmp, toggleColorScheme } from "../../lib/utils";

interface Config {
    bar: Bar;
    barLayout: BarLayout;
    usage: Usage;
    qs: QS;
    weather: Weather;
    screenRecord: ScreenRecord;
    dashboard: Dashboard;
    applauncher: Applauncher;
    notificationPopupWindow: NotificationPopupWindow;
    overview: Overview;
    osd: OSD;
    wifi: Wifi;
    brightness: Brightness;
    common: Common;
    themeVariables: ThemeVariables;
    theme_dark: ThemeColors;
    theme_light: ThemeColors;
}

interface Bar {
    visiblePowermenu: boolean; // powermenu visible by default (used to control powermenu state)
    visibleQSMainPage: boolean; // qs main page visible by default (used to control qs main page state)
    enableBarButtons: boolean; // enables buttons in bar
    enableBarUsage: boolean; // enables usage (cpu, ram, disk, bt %) all widgets
    enableBarApplauncher: boolean; // enables Applauncher widget
    applauncherIcon: string; // Applauncher widget icon (string)
    enableBarTaskbar: boolean; // enables Taskbar widget
    enableBarWorkspaces: boolean; // enables Workspaces widget
    enableBarMediaIndicator: boolean; // enables Media Indicator widget
    enableBarDateTime: boolean; // enables Date and Time widget
    dateTimeFormat: string; // date and time format
    enableBarWeather: boolean; // enables Weather widget
    enableBarNotifications: boolean; // enables Notifications Revealer widget
    enableBarRecordingIndicator: boolean; // enables Recording Indicator widget
    enableBarUsageCpu: boolean; // enables CPU % usage widget
    enableBarUsageRam: boolean; // enables RAM GB usage widget
    enableBarUsageDisk: boolean; // enables DISK % usage widget
    enableBarUsageBluetooth: boolean; // enables Bluetooth % usage widget
    enableBarSysTray: boolean; // enables SysTray widget
    enableBarSystemIndicators: boolean; // enables System Indicators widget
    enableBarPowermenu: boolean; // enables Powermenu widget
    enableCommandOpenStartupApps: boolean; // enables command to open startup apps
    barMarginTop: number; // to make topbar floating, margin-top
    barMarginBottom: number; // to make topbar floating, margin-bottom
    barMarginLeft: number; // to make topbar floating, margin-left
    barMarginRight: number; // to make topbar floating, margin-right
}

interface BarLayout {
    startLeft: string[]; // bar widgets start-left (most left)
    startRight: string[]; // bar widgets start-right (left before center)
    center: string[]; // bar widgets in center
    endLeft: string[]; // bar widgets end-left (left after center)
    endRight: string[]; // bar widgets end-right (most right)
}

interface Usage {
    barUsageSpacing: number; // usage-box, for all usage widgets spacing={}
    diskUsageSpacing: number; // disk usage spacing={}
    diskUsagePoolRate: number; // pool rate to fetch disk usage
    ramUsageSpacing: number; // ram usage spacing={}
    ramUsageDecimals: number; // decimals to show for ram usage %
    ramUsagePoolRate: number; // pool rate to fetch ram usage
    cpuUsageSpacing: number; // cpu usage spacing={}
    cpuUsagePoolRate: number; // pool rate to fetch cpu usage
    cpuUsageDecimals: number; // decimals to show for cpu usage %
}

interface QS {
    qsTogglesSpacing: number; // QS toggles row spacing={}
    qsRowSpacing: number; // QS toggles page spacing={}
    maxItemsPerRowQSToggles: number; // max items per row in QS toggles (ex. 2)
    maxItemsPerColumnQSToggles: number; // max items per column in QS toggles (ex. 3)
    qsTogglesPage: string; // used to control QS Toggles Page state
    qsPage: string; // used to control QS Page state
    qsRevealSinksButton: boolean; // used to control Sinks button state
    qsRevealSinksSpacing: number; // QS reveal Sinks spacing={}
    qsRevealScreenRecord: boolean; // used to control Screenrecord button state
    qsRevealScreenRecordSpacing: number; // QS reveal Screenrecord spacing={}
    qsRevealScreenshot: boolean; // used to control Screenshot button state
    qsRevealScreenshotSpacing: number; // QS reveal Screenshot spacing={}
    qsRevealLightstrip: boolean; // used to control Lightstrip button state
    qsRevealLightstripSpacing: number; // QS reveal Lightstrip spacing={}
    qsShowMediaPlayer: boolean; // show / hide media player in QS
    qsShowWeatherSchedule: boolean; // show / hide weather schedule widget in QS
    qsShowSinksRevealerButton: boolean; // show / hide sinks revealer button in QS
    qsShowAudioSlider: boolean; // show / hide volume widget (Audio Slider) in QS
    qsShowBrightnessSlider: boolean; // show / hide brightness widget (Brightness Slider) in QS
    qsShowToggles: boolean; // show / hide toggles in QS
    qsToggles: string[]; // qs toggles keys (order to be created in)
}

interface Weather {
    namespaceWeather: string; // Weather namespace
    qsWeatherScheduleDays: number; // number of days to render for QS widget
    weatherWidth: number; // width for popup
    weatherBoxTopMargin: number; // top margin between topbar
    weatherContentWidth: number; // content (widget) width
}

interface ScreenRecord {
    recordInternalAudioToggle: boolean; // used to control internal audio toggle state
    recordOnlySelectedScreenToggle: boolean; // used to control record selected area toggle state
    recordSaveDateFormat: string; // file name to make it unique (date format)
    recordScreenrecordsDir: string; // screenrecord save directory
    recordScreenshotsDir: string; // screenshot save directory
}

interface Dashboard {
    enableDashboard: boolean; // enable Dashboard
    namespaceDashboard: string; // Dashboard namespace
    dashboardWidth: number; // width for popup
    dashboardBoxTopMargin: number; // top margin between topbar
    dashboardContentWidth: number; // content (widget) width
}

interface Applauncher {
    namespaceApplauncher: string; // Applauncher namespace
    applauncherWidth: number; // width for popup
    applauncherBoxTopMargin: number; // top margin between topbar
    applauncherContentWidth: number; // content (widget) width
    applauncherScrollableHeight: number; // scrollable max heightRequest, used for calculation
    applauncherSingleItemHeight: number; // height of single item, used to calculate scrollable heightRequest
}

interface NotificationPopupWindow {
    enableNotificationPopups: boolean; // enable notifications popups
    removeAllPreviousNotificationOnStart: boolean; // enable to remove all previous notification on ags start (unread)
    namespaceNotification: string; // Notification namespace
    notificationWidth: number; // width for popup
    notificationBoxTopMargin: number; // top margin between topbar
    notificationContentWidth: number; // content (widget) width
    notificationScrollableMaxHeight: number; // scrollable max heightRequest, Math.min(n.length * notificationHeight, notificationScrollableMaxHeight)
    notificationHeight: number; // height of single notification, used to calculate scrollable heightRequest
    notificationContentHeight: number; // height of Notification area (not including NotificationIcon or Actions), not just popup
    notificationSpacing: number; // NotificationsWindow spacing={} for AllNotifications
}

interface Overview {
    overviewEnabled: boolean; // enable Overview widget
    namespaceOverview: string; // Overview namespace
    workspaces: number; // overview in topbar total workspaces to render (ex. 10)
    overviewWidth: number; // width for popup
    overviewBoxTopMargin: number; // top margin between topbar
    overviewContentWidth: number; // content (widget) width
    overviewScale: number; // scale factor for overview icons and boxes
}

interface OSD {
    enableOsd: boolean; // enables osd
    osdLevelbarWidth: number; // width of OSD levelbar
}

interface Wifi {
    hasWifi: boolean; // enable if device has wifi for qs tile and qs page
}

interface Brightness {
    hasBrightness: boolean; // enable if device has brightness for OSD and Brightness slider
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

interface ThemeVariables {
    radius: string; // border-radius used across all widgets
    barRadius: string; // border-radius used for bar (useful for floating bar)
    barMediaCoverHeight: string; // min-height of bar media Cover image
    barMediaCoverWidth: string; // min-width of bar media Cover image
    barHeight: string; // controls bar height
    togglesSpace: string; // qs space between SinkButton and AudioSlider
    qsElementsTopMargin: string; // qs-main-page (weather, MediaPlayer and menu) top margin to separate it from other elements
    qsTogglesWidth: string; // qs toggles min-width
    qsTogglesEmptyWidth: string; // qs empty toggle min-width
    qsTogglesHeight: string; // qs toggles min-height
    qsTogglesIconMarginLeft: string; // qs toggles Icon margin-left to space out icon from toggle
    qsTogglesLabelMarginLeft: string; // qs toggles Label margin-left to space out text from icon
    qsSliderHighlightWidth: string; // qs volume slider min-width
    qsSliderIconMarginLeft: string; // qs volume/brightness Icon margin-left
    qsMenuPadding: string; // qs menu padding
    osdMinWidth: string; // osd min-width
    osdLevelbarHeight: string; // osd levelbar min-height
    osdLevelbarLowWidth: string; // osd levelbar when Low (ex. low volume) min-width
    powermenuButtonRadius: string; // powermenu buttons border-radius
    powermenuButtonPadding: string; // powermenu buttons padding
    powermenuButtonWidth: string; // powermenu buttons min-width
    powermenuButtonHeight: string; // powermenu buttons min-height
    powermenuButtonMargin: string; // powermenu buttons margin
    appLauncherRadius: string; // app-launcher border-radius
    appLauncherEntryIconSize: string; // app-launcher Icon font-size
    appLauncherHeaderMargin: string; // app-launcher Header margin
    appLauncherEntryMargin: string; // app-launcher Entry margin (header icon)
    appLauncherScrollablePadding: string; // app-launcher Scrollable padding
    appLauncherButtonIconSize: string; // app-launcher button Icon font-size
    appLauncherButtonPadding: string; // app-launcher button padding
    appLauncherButtonMinHeight: string; // app-launcher button min-height
    calendarWeekdaysTopMargin: string; // dashboard - calendar - weekdays top-margin
    weatherMainBoxMinWidth: string; // weather - main box min-width
    weatherInfoMinWidth: string; // weather - weather-info min-width
    weatherInfoMinHeight: string; // weather - weather-info min-height
    weatherChildBoxMinWidth: string; // weather - qs-weather-box-child min-width
    notificationIconMinWidth: string; // notification - icon/image min-width
    notificationIconMinHeight: string; // notification - icon/image min-height
    notificationIconRadius: string; // notification - icon/image border-radius
    notificationIconMargin: string; // notification - icon/image margin
    notificationMinWidth: string; // notification min-width
    overviewAppRadius: string; // overview border-radius
}

interface ThemeColors {
    black: string; // used when needed pure black / white color depending on the theme (ex. applauncher box-shadow, osd levelbar trough background-color)
    bgColor: string; // used to set background Color
    fgColor: string; // used to set foreground Color
    accent: string; // accent color
    error: string; // error color for notifications - critical
    redRecording: string; // recording indicator button color
    redRecordingText: string; // recording indicator text color
    red: string; // used to create redTransparent color
    closeRed: string; // used to create closeRedTransparent color
    primaryContainer: string; // qs menu active (toggle on) color, bluetooth battery label in QS bt menu
    shadowColor: string; // osd levelbar trough filled, used to create hover, shadowTransparent color
    inverseSurface: string; // used to create inverseSurfaceTransparent color
    yellow: string; // bar notifications icon and label
    notificationBackground: string; // Notification background color
    mediaPlayerActionIcon: string; // media player action color
    overview: string; // overview - workspace and client color
    bgTransparent: string; // Applauncher background color
    popupTransparent: string; // Popup powermenu background (used for overview - shadow and workspace border colors)
    accentTransparent: string; // bar active button and workspace dot color
    hover: string; // :hover color
    osd: string; // osd background-color
    redTransparent: string; // powermenu-button and mic-indicator-icon-mute color
    shadowTransparent: string; // transparent shadowColor (qs menu-button outline, calendar-button-other-month, workspace-dot bg color)
    inverseSurfaceTransparent: string; // used when needed default button background color
    closeRedTransparent: string; // notification close button red color
    accentGradient: string; // used mostly for accents (gradient is plus over pure accent color)
    hoverShadow: string; // :hover box-shadow color
    focusShadow: string; // :focus box-shadow color
    focusShadowTransparent: string; // qs-main-page button :focus color, transparent version of focusShadow
}

let configDefaults: Config = {
    bar: {
        visiblePowermenu: false,
        visibleQSMainPage: false,
        enableBarButtons: false,
        enableBarUsage: true,
        enableBarApplauncher: true,
        applauncherIcon: "",
        enableBarTaskbar: true,
        enableBarWorkspaces: true,
        enableBarMediaIndicator: true,
        enableBarDateTime: true,
        dateTimeFormat: "%a %b %e   %H:%M:%S",
        enableBarWeather: true,
        enableBarNotifications: true,
        enableBarRecordingIndicator: true,
        enableBarUsageCpu: true,
        enableBarUsageRam: true,
        enableBarUsageDisk: true,
        enableBarUsageBluetooth: true,
        enableBarSysTray: true,
        enableBarSystemIndicators: true,
        enableBarPowermenu: true,
        enableCommandOpenStartupApps: true,
        barMarginTop: 0,
        barMarginBottom: 0,
        barMarginLeft: 0,
        barMarginRight: 0,
    },
    barLayout: {
        startLeft: [
            "AppLauncher",
            "Taskbar",
            "Workspaces",
        ],
        startRight: [
            "Media",
        ],
        center: [
            "Time",
        ],
        endLeft: [
            "WeatherButton",
            "NotificationsRevealerButton",
        ],
        endRight: [
            "RecordingIndicatorButton",
            "UsageBox",
            "BarButtons",
            "SysTray",
            // "BatteryLevel",
            "systemIndicators",
            "powermenu",
        ],
    },
    usage: {
        barUsageSpacing: 10,
        diskUsageSpacing: 12,
        diskUsagePoolRate: 600000,
        ramUsageSpacing: 12,
        ramUsageDecimals: 1,
        ramUsagePoolRate: 2000,
        cpuUsageSpacing: 12,
        cpuUsagePoolRate: 2000,
        cpuUsageDecimals: 1,
    },
    qs: {
        qsTogglesSpacing: 4,
        qsRowSpacing: 5,
        maxItemsPerRowQSToggles: 2,
        maxItemsPerColumnQSToggles: 3,
        qsTogglesPage: "qs-page-0",
        qsPage: "main",
        qsRevealSinksButton: false,
        qsRevealSinksSpacing: 16,
        qsRevealScreenRecord: false,
        qsRevealScreenRecordSpacing: 16,
        qsRevealScreenshot: false,
        qsRevealScreenshotSpacing: 16,
        qsRevealLightstrip: false,
        qsRevealLightstripSpacing: 16,
        qsShowMediaPlayer: true,
        qsShowWeatherSchedule: true,
        qsShowSinksRevealerButton: true,
        qsShowAudioSlider: true,
        qsShowBrightnessSlider: true,
        qsShowToggles: true,
        qsToggles: [
            "BluetoothToggle",
            "NightlightToggle",
            "MicrophoneToggle",
            "ScreenshotToggle",
            "IdleToggle",
            "LightstripToggle",
            "NetworkToggle",
            "ScreenRecordToggle",
            "DNDToggle",
            "ColorPickerToggle",
            "NoteToggle",
            "ColorToggle",
            // "QSEmptyButton"
        ],
    },
    weather: {
        namespaceWeather: "weather",
        qsWeatherScheduleDays: 5,
        weatherWidth: 1000,
        weatherBoxTopMargin: 35,
        weatherContentWidth: 200,
    },
    screenRecord: {
        recordInternalAudioToggle: false,
        recordOnlySelectedScreenToggle: false,
        recordSaveDateFormat: "%Y-%m-%d_%H-%M-%S",
        recordScreenrecordsDir: "/Videos/Screenrecords",
        recordScreenshotsDir: "/Pictures/Screenshots",
    },
    dashboard: {
        enableDashboard: true,
        namespaceDashboard: "dashboard",
        dashboardWidth: 1000,
        dashboardBoxTopMargin: 35,
        dashboardContentWidth: 200,
    },
    applauncher: {
        namespaceApplauncher: "launcher",
        applauncherWidth: 1000,
        applauncherBoxTopMargin: 800,
        applauncherContentWidth: 500,
        applauncherScrollableHeight: 370,
        applauncherSingleItemHeight: 50,
    },
    notificationPopupWindow: {
        enableNotificationPopups: true,
        removeAllPreviousNotificationOnStart: true,
        namespaceNotification: "notification",
        notificationWidth: 1000,
        notificationBoxTopMargin: 35,
        notificationContentWidth: 450,
        notificationScrollableMaxHeight: 500,
        notificationHeight: 400,
        notificationContentHeight: 60,
        notificationSpacing: 10,
    },
    overview: {
        overviewEnabled: true,
        namespaceOverview: "overview",
        workspaces: 10,
        overviewWidth: 1000,
        overviewBoxTopMargin: 35,
        overviewContentWidth: 200,
        overviewScale: 0.06,
    },
    osd: {
        enableOsd: true,
        osdLevelbarWidth: 100,
    },
    wifi: {
        hasWifi: true,
    },
    brightness: {
        hasBrightness: false,
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
    themeVariables: {
        radius: "1.5rem",
        barRadius: "0rem",
        barMediaCoverHeight: "1.2rem",
        barMediaCoverWidth: "1.2rem",
        barHeight: "27px",
        togglesSpace: "0 0.2rem",
        qsElementsTopMargin: "0.5rem",
        qsTogglesWidth: "10.7rem",
        qsTogglesEmptyWidth: "10.7rem * 1.11",
        qsTogglesHeight: "2.2rem",
        qsTogglesIconMarginLeft: "0.6rem",
        qsTogglesLabelMarginLeft: "0.6rem",
        qsSliderHighlightWidth: "2.2rem",
        qsSliderIconMarginLeft: "0.6rem",
        qsMenuPadding: "1.5rem",
        osdMinWidth: "12rem",
        osdLevelbarHeight: "0.8rem",
        osdLevelbarLowWidth: "0.8rem",
        powermenuButtonRadius: "50%",
        powermenuButtonPadding: "0rem",
        powermenuButtonWidth: "7rem",
        powermenuButtonHeight: "7rem",
        powermenuButtonMargin: "0.5rem",
        appLauncherRadius: "$radius * 0.6",
        appLauncherEntryIconSize: "1.2rem",
        appLauncherHeaderMargin: "0.3rem 0.8rem 0.3rem 0.8rem",
        appLauncherEntryMargin: "0 0.7rem 0 0.5rem",
        appLauncherScrollablePadding: "0.3rem 0 0.5rem 0",
        appLauncherButtonIconSize: "1.8rem",
        appLauncherButtonPadding: "0.2rem 1rem 0.2rem 0.6rem",
        appLauncherButtonMinHeight: "2.5rem",
        calendarWeekdaysTopMargin: "0.8rem",
        weatherMainBoxMinWidth: "16.5em",
        weatherInfoMinWidth: "5em",
        weatherInfoMinHeight: "10em",
        weatherChildBoxMinWidth: "5em",
        notificationIconMinWidth: "3rem",
        notificationIconMinHeight: "3rem",
        notificationIconRadius: "$radius * 0.6",
        notificationIconMargin: "0 0 0 1rem",
        notificationMinWidth: "400px",
        overviewAppRadius: "$radius * 0.6",
    },
    theme_dark: {
        black: "#000000",
        bgColor: "#171717",
        fgColor: "#f1f1f1",
        accent: "#51a4e7",
        error: "red",
        redRecording: "#93000a",
        redRecordingText: "#ffdad6",
        red: "#e55f86",
        closeRed: "#3d3231",
        primaryContainer: "#73342c",
        shadowColor: "#eeeeee",
        inverseSurface: "#f1dedc",
        yellow: "#EBFF71",
        notificationBackground: "#282626",
        mediaPlayerActionIcon: "#ffffff",
        overview: "rgba(238, 238, 238, 0.06)",
        bgTransparent: "color.adjust($bgColor, $alpha: -0.05)",
        popupTransparent: "color.adjust($black, $alpha: -0.68)",
        accentTransparent: "color.adjust($accent, $alpha: -0.4)",
        hover: "color.adjust($shadowColor, $alpha: -0.80)",
        osd: "color.adjust(gray, $alpha: -0.10)",
        redTransparent: "color.adjust($red, $alpha: -0.3)",
        shadowTransparent: "color.adjust($shadowColor, $alpha: -0.5)",
        inverseSurfaceTransparent: "color.adjust($inverseSurface, $alpha: -0.92)",
        closeRedTransparent: "color.adjust($closeRed, $alpha: -0.5)",
        accentGradient: "linear-gradient(to right, #51a4e7, #6cb2eb)",
        hoverShadow: "inset 0 0 0 9999px rgba(255, 255, 255, 0.2)",
        focusShadow: "inset 0 0 0 2px rgba(255, 255, 255, 0.4)",
        focusShadowTransparent: "inset 0 0 0 2px rgba(255, 255, 255, 0.2)",
    },
    theme_light: {
        black: "#ffffff",
        bgColor: "#f9f9f9",
        fgColor: "#171717",
        accent: "#51a4e7",
        error: "red",
        redRecording: "#93000a",
        redRecordingText: "#93000a",
        red: "#e55f86",
        closeRed: "#3d3231",
        primaryContainer: "#ffccbc",
        shadowColor: "#333333",
        inverseSurface: "#333333",
        yellow: "gray",
        notificationBackground: "#e0e0e0",
        mediaPlayerActionIcon: "#ffffff",
        overview: "rgba(51, 51, 51, 0.06)",
        bgTransparent: "color.adjust($bgColor, $alpha: -0.05)",
        popupTransparent: "color.adjust($black, $alpha: -0.68)",
        accentTransparent: "color.adjust($accent, $alpha: -0.4)",
        hover: "color.adjust($shadowColor, $alpha: -0.80)",
        osd: "color.adjust(gray, $alpha: -0.10)",
        redTransparent: "color.adjust($red, $alpha: -0.3)",
        shadowTransparent: "color.adjust($shadowColor, $alpha: -0.5)",
        inverseSurfaceTransparent: "color.adjust($inverseSurface, $alpha: -0.92)",
        closeRedTransparent: "color.adjust($closeRed, $alpha: -0.5)",
        accentGradient: "linear-gradient(to right, #51a4e7, #6cb2eb)",
        hoverShadow: "inset 0 0 0 9999px rgba(0, 0, 0, 0.2)",
        focusShadow: "inset 0 0 0 2px rgba(0, 0, 0, 0.4)",
        focusShadowTransparent: "inset 0 0 0 2px rgba(0, 0, 0, 0.2)",
    },
};

// Override config defaults with user's options
function overrideConfigRecursive(target: Config, source: {}) {
    for (const key of Object.keys(source)) {
        if (source[key] instanceof Object && key in target) {
            overrideConfigRecursive(target[key], source[key]);
        } else {
            target[key] = source[key];
        }
    }
}

export const config: Config = configDefaults;

try {
    const variablesConfigFile = "config.jsonc";
    const configDir = GLib.get_user_config_dir();
	const configFileOverride = `${configDir}/.ags-override/${variablesConfigFile}`;

    if (fileExists(configFileOverride)) {
        const configOverrideContent = await readFileAsync(configFileOverride).catch(console.error);
        if (configOverrideContent) {
            overrideConfigRecursive(configDefaults, JSON.parse(configOverrideContent));
            Object.assign(config, configDefaults);
        }
    }
} catch (e) {
    console.log("Error loading config file.", e);
}

export async function initScss(themeMode?: ThemeMode) {
	const color = getThemeColor(themeMode);

	const theme = config[`theme_${color}`];

	if (!theme) {
		console.log("Error no theme defined");
		return;
	}

	const scssColorVariables = [
        "@use 'sass:color' as color;"
    ];

	Object.entries(theme).forEach(([key, value]) => {
		scssColorVariables.push(`$${key}: ${value};`);
	});

	if (scssColorVariables.length <= 1) {
		console.log("Error no theme colors defined");
		return;
	}

	const themeVariables = config.themeVariables;

    Object.entries(themeVariables).forEach(([key, value]) => {
		scssColorVariables.push(`$${key}: ${value};`);
	});

    if (scssColorVariables.length <= 1) {
		console.log("Error no theme variables defined");
		return;
	}

    await syncVariablesToTmp(scssColorVariables);
}

export async function toggleColorMode() {
    toggleColorScheme();
    await initScss();
}
