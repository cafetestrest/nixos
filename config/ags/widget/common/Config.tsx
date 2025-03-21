import { GLib, readFileAsync } from "astal";
import { fileExists } from "../../lib/utils";

interface Config {
    bar: Bar;
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
}

interface Bar {
    visiblePowermenu: boolean; // powermenu visible by default (used to control powermenu state)
    visibleQSMainPage: boolean; // qs main page visible by default (used to control qs main page state)
    enableBarButtons: boolean; // enables buttons in bar
    enableBarUsage: boolean; // enables usage (cpu, ram, disk ) widgets
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
    namespaceOverview: string; // Overview namespace
    workspaces: number; // overview in topbar total workspaces to render (ex. 10)
    overviewWidth: number; // width for popup
    overviewBoxTopMargin: number; // top margin between topbar
    overviewContentWidth: number; // content (widget) width
    overviewScale: number; // scale factor for overview icons and boxes
}

interface OSD {
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

const configDefaults: Config = {
    bar: {
        visiblePowermenu: false,
        visibleQSMainPage: false,
        enableBarButtons: false,
        enableBarUsage: true,
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
        namespaceOverview: "overview",
        workspaces: 10,
        overviewWidth: 1000,
        overviewBoxTopMargin: 35,
        overviewContentWidth: 200,
        overviewScale: 0.06,
    },
    osd: {
        osdLevelbarWidth: 100,
    },
    wifi: {
        hasWifi: false,
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
};

export const config: Config = configDefaults;

try {
    const variablesConfigFile = "config.jsonc";
    const configDir = GLib.get_user_config_dir();
	const configFileOverride = `${configDir}/.ags-override/${variablesConfigFile}`;

    if (fileExists(configFileOverride)) {
        const configOverrideContent = await readFileAsync(configFileOverride).catch(console.error);

        if (configOverrideContent) {
            Object.assign(config, JSON.parse(configOverrideContent));
        }
    }
} catch (e) {
    console.log("Error loading config file.", e);
}
