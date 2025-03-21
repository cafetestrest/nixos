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
    barUsageSpacing: number;
    diskUsageSpacing: number;
    diskUsagePoolRate: number;
    ramUsageSpacing: number;
    ramUsageDecimals: number;
    ramUsagePoolRate: number;
    cpuUsageSpacing: number;
    cpuUsagePoolRate: number;
    cpuUsageDecimals: number;
}

interface QS {
    qsTogglesSpacing: number;
    qsRowSpacing: number;
    maxItemsPerRowQSToggles: number;
    maxItemsPerColumnQSToggles: number;
    qsTogglesPage: string;
    qsPage: string;
    qsRevealSinksButton: boolean;
    qsRevealSinksSpacing: number;
    qsRevealScreenRecord: boolean;
    qsRevealScreenRecordSpacing: number;
    qsRevealScreenshot: boolean;
    qsRevealScreenshotSpacing: number;
    qsRevealLightstrip: boolean;
    qsRevealLightstripSpacing: number;
}

interface Weather {
    namespaceWeather: string;
    qsWeatherScheduleDays: number;
    weatherWidth: number;
    weatherBoxTopMargin: number;
    weatherContentWidth: number;
}

interface ScreenRecord {
    recordInternalAudioToggle: boolean;
    recordOnlySelectedScreenToggle: boolean;
    recordSaveDateFormat: string;
    recordScreenrecordsDir: string;
    recordScreenshotsDir: string;
}

interface Dashboard {
    namespaceDashboard: string;
    dashboardWidth: number;
    dashboardBoxTopMargin: number;
    dashboardContentWidth: number;
}

interface Applauncher {
    namespaceApplauncher: string;
    applauncherWidth: number;
    applauncherBoxTopMargin: number;
    applauncherContentWidth: number;
    applauncherScrollableHeight: number;
    applauncherSingleItemHeight: number;
}

interface NotificationPopupWindow {
    removeAllPreviousNotificationOnStart: boolean;
    namespaceNotification: string;
    notificationWidth: number;
    notificationBoxTopMargin: number;
    notificationContentWidth: number;
    notificationScrollableMaxHeight: number;
    notificationHeight: number;
    notificationContentHeight: number;
    notificationSpacing: number;
}

interface Overview {
    namespaceOverview: string;
    workspaces: number;
    overviewWidth: number;
    overviewBoxTopMargin: number;
    overviewContentWidth: number;
    overviewScale: number;
}

interface OSD {
    osdLevelbarWidth: number;
}

interface Wifi {
    hasWifi: boolean;
}

interface Brightness {
    hasBrightness: boolean;
}

interface Common {
    commandOpenNote: string;
    commandSelectRegion: string;
    commandStartScreenRecord: string;
    commandColorPicker: string;
    commandOpenStartupApps: string;
    commandScreenshotWholeDisplay: string;
    commandScreenshotSelectRegion: string;
    commandScreenshotSelectWindow: string;
    commandGetLightstripIp: string;
    commandTurnOnLightstrip: string;
    commandTurnOffLightstrip: string;
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
