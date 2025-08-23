import { createState } from "ags";
import { config } from "./Config";

// bar
export const [visiblePowermenu,setVisiblePowermenu] = createState(config.bar.visiblePowermenu);
export const [visibleQSMainPage,setVisibleQSMainPage] = createState(config.bar.visibleQSMainPage);
export const enableBarButtons = config.bar.enableBarButtons;
export const enableBarUsage = config.bar.enableBarUsage;
export const enableBarApplauncher = config.bar.enableBarApplauncher;
export const applauncherIcon = config.bar.applauncherIcon;
export const enableBarTaskbar = config.bar.enableBarTaskbar;
export const enableBarWorkspaces = config.bar.enableBarWorkspaces;
export const enableBarMediaIndicator = config.bar.enableBarMediaIndicator;
export const enableBarDateTime = config.bar.enableBarDateTime;
export const dateTimeFormat = config.bar.dateTimeFormat;
export const enableBarWeather = config.bar.enableBarWeather;
export const enableBarNotifications = config.bar.enableBarNotifications;
export const enableBarRecordingIndicator = config.bar.enableBarRecordingIndicator;
export const enableBarUsageCpu = config.bar.enableBarUsageCpu;
export const enableBarUsageRam = config.bar.enableBarUsageRam;
export const enableBarUsageDisk = config.bar.enableBarUsageDisk;
export const enableBarUsageBluetooth = config.bar.enableBarUsageBluetooth;
export const enableBarSysTray = config.bar.enableBarSysTray;
export const enableBarSystemIndicators = config.bar.enableBarSystemIndicators;
export const enableBarPowermenu = config.bar.enableBarPowermenu;
export const enableCommandOpenStartupApps = config.bar.enableCommandOpenStartupApps;
export const barMarginTop = config.bar.barMarginTop;
export const barMarginBottom = config.bar.barMarginBottom;
export const barMarginLeft = config.bar.barMarginLeft;
export const barMarginRight = config.bar.barMarginRight;

// bar layour
export const barLayoutStartLeft = config.barLayout.startLeft;
export const barLayoutStartRight = config.barLayout.startRight;
export const barLayoutCenter = config.barLayout.center;
export const barLayoutEndLeft = config.barLayout.endLeft;
export const barLayoutEndRight = config.barLayout.endRight;

// usage
export const barUsageSpacing = config.usage.barUsageSpacing;
export const diskUsageSpacing = config.usage.diskUsageSpacing;
export const diskUsagePoolRate = config.usage.diskUsagePoolRate;
export const ramUsageSpacing = config.usage.ramUsageSpacing;
export const ramUsageDecimals = config.usage.ramUsageDecimals;
export const ramUsagePoolRate = config.usage.ramUsagePoolRate;
export const cpuUsageSpacing = config.usage.cpuUsageSpacing;
export const cpuUsagePoolRate = config.usage.cpuUsagePoolRate;
export const cpuUsageDecimals = config.usage.cpuUsageDecimals;

// qs
export const qsTogglesSpacing = config.qs.qsTogglesSpacing;
export const qsRowSpacing = config.qs.qsRowSpacing;
export const maxItemsPerRowQSToggles = config.qs.maxItemsPerRowQSToggles;
export const maxItemsPerColumnQSToggles = config.qs.maxItemsPerColumnQSToggles;
export const [qsTogglesPage,setQsTogglesPage] = createState(config.qs.qsTogglesPage);
export const [qsPage,setQsPage] = createState(config.qs.qsPage);
export const [qsRevealSinksButton,setQsRevealSinksButton] = createState(config.qs.qsRevealSinksButton);
export const qsRevealSinksSpacing = config.qs.qsRevealSinksSpacing;
export const [qsRevealScreenRecord,setQsRevealScreenRecord] = createState(config.qs.qsRevealScreenRecord);
export const qsRevealScreenRecordSpacing = config.qs.qsRevealScreenRecordSpacing;
export const [qsRevealScreenshot,setQsRevealScreenshot] = createState(config.qs.qsRevealScreenshot);
export const qsRevealScreenshotSpacing = config.qs.qsRevealScreenshotSpacing;
export const [qsRevealLightstrip,setQsRevealLightstrip] = createState(config.qs.qsRevealLightstrip);
export const qsRevealLightstripSpacing = config.qs.qsRevealLightstripSpacing;
export const qsShowMediaPlayer = config.qs.qsShowMediaPlayer;
export const qsShowWeatherSchedule = config.qs.qsShowWeatherSchedule;
export const qsShowSinksRevealerButton = config.qs.qsShowSinksRevealerButton;
export const qsShowAudioSlider = config.qs.qsShowAudioSlider;
export const qsShowBrightnessSlider = config.qs.qsShowBrightnessSlider;
export const qsShowToggles = config.qs.qsShowToggles;
export const qsToggles = config.qs.qsToggles;

// weather
export const namespaceWeather = config.weather.namespaceWeather;
export const qsWeatherScheduleDays = config.weather.qsWeatherScheduleDays;
export const [weatherWidth,setWeatherWidth] = createState(config.weather.weatherWidth);
export const weatherBoxTopMargin = config.weather.weatherBoxTopMargin;
export const weatherContentWidth = config.weather.weatherContentWidth;

// screen record
export const [recordInternalAudioToggle,setRecordInternalAudioToggle] = createState(config.screenRecord.recordInternalAudioToggle);
export const [recordOnlySelectedScreenToggle,setRecordOnlySelectedScreenToggle] = createState(config.screenRecord.recordOnlySelectedScreenToggle);
export const recordSaveDateFormat = config.screenRecord.recordSaveDateFormat;
export const recordScreenrecordsDir = config.screenRecord.recordScreenrecordsDir;
export const recordScreenshotsDir = config.screenRecord.recordScreenshotsDir;

// dashboard
export const enableDashboard = config.dashboard.enableDashboard;
export const namespaceDashboard = config.dashboard.namespaceDashboard;
export const [dashboardWidth,setDashboardWidth] = createState(config.dashboard.dashboardWidth);
export const dashboardBoxTopMargin = config.dashboard.dashboardBoxTopMargin;
export const dashboardContentWidth = config.dashboard.dashboardContentWidth;

// applauncher
export const namespaceApplauncher = config.applauncher.namespaceApplauncher;
export const [applauncherWidth,setApplauncherWidth] = createState(config.applauncher.applauncherWidth);
export const applauncherBoxTopMargin = config.applauncher.applauncherBoxTopMargin;
export const applauncherContentWidth = config.applauncher.applauncherContentWidth;
export const applauncherScrollableHeight = config.applauncher.applauncherScrollableHeight;
export const applauncherSingleItemHeight = config.applauncher.applauncherSingleItemHeight;

// notification popup window
export const enableNotificationPopups = config.notificationPopupWindow.enableNotificationPopups;
export const removeAllPreviousNotificationOnStart = config.notificationPopupWindow.removeAllPreviousNotificationOnStart;
export const namespaceNotification = config.notificationPopupWindow.namespaceNotification;
export const [notificationWidth,setNotificationWidth] = createState(config.notificationPopupWindow.notificationWidth);
export const notificationBoxTopMargin = config.notificationPopupWindow.notificationBoxTopMargin;
export const notificationContentWidth = config.notificationPopupWindow.notificationContentWidth;
export const notificationScrollableMaxHeight = config.notificationPopupWindow.notificationScrollableMaxHeight;
export const notificationHeight = config.notificationPopupWindow.notificationHeight;
export const notificationContentHeight = config.notificationPopupWindow.notificationContentHeight;
export const notificationSpacing = config.notificationPopupWindow.notificationSpacing;

// overview
export const overviewEnabled = config.overview.overviewEnabled;
export const namespaceOverview = config.overview.namespaceOverview;
export const workspaces = config.overview.workspaces;
export const [overviewWidth,setOverviewWidth] = createState(config.overview.overviewWidth);
export const overviewBoxTopMargin = config.overview.overviewBoxTopMargin;
export const overviewContentWidth = config.overview.overviewContentWidth;
export const overviewScale = config.overview.overviewScale;

// osd
export const enableOsd = config.osd.enableOsd;
export const osdLevelbarWidth = config.osd.osdLevelbarWidth;

// wifi
export const hasWifi = config.wifi.hasWifi;

// brightness
export const hasBrightness = config.brightness.hasBrightness;

// common
export const commandOpenNote = config.common.commandOpenNote;
export const commandSelectRegion = config.common.commandSelectRegion;
export const commandStartScreenRecord = config.common.commandStartScreenRecord;
export const commandColorPicker = config.common.commandColorPicker;
export const commandOpenStartupApps = config.common.commandOpenStartupApps;
export const commandScreenshotWholeDisplay = config.common.commandScreenshotWholeDisplay;
export const commandScreenshotSelectRegion = config.common.commandScreenshotSelectRegion;
export const commandScreenshotSelectWindow = config.common.commandScreenshotSelectWindow;
export const commandGetLightstripIp = config.common.commandGetLightstripIp;
export const commandTurnOnLightstrip = config.common.commandTurnOnLightstrip;
export const commandTurnOffLightstrip = config.common.commandTurnOffLightstrip;

// function to close all revealers when hitting any button in qs
export function qsRevertRevealerStatus(str: string) {
    if (str !== "screen-record") {
        setQsRevealScreenRecord(false);
    }

    if (str !== "screenshot") {
        setQsRevealScreenshot(false);
    }

    if (str !== "lightstrip") {
        setQsRevealLightstrip(false);
    }

    if (str !== "sinks") {
        setQsRevealSinksButton(false);
    }
}

export function qsToggleRevealer(str: string) {
    switch (str) {
        case "screen-record":
            setQsRevealScreenRecord(!qsRevealScreenRecord.get());
            break;
        case "screenshot":
            setQsRevealScreenshot(!qsRevealScreenshot.get());
            break;
        case "lightstrip":
            setQsRevealLightstrip(!qsRevealLightstrip.get());
            break;
        case "sinks":
            setQsRevealSinksButton(!qsRevealSinksButton.get());
            break;
    }
}

export function isQSRevealerOpen(): boolean {
    if (qsRevealScreenRecord.get()) {
        return true;
    }

    if (qsRevealScreenshot.get()) {
        return true;
    }

    if (qsRevealLightstrip.get()) {
        return true;
    }

    if (qsRevealSinksButton.get()) {
        return true;
    }
    return false;
}
