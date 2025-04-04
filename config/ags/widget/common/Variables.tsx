import { Variable } from "astal";
import { config } from "./Config";

// bar
export const visiblePowermenu = Variable(config.bar.visiblePowermenu);
export const visibleQSMainPage = Variable(config.bar.visibleQSMainPage);
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
export const qsTogglesPage = Variable(config.qs.qsTogglesPage);
export const qsPage = Variable(config.qs.qsPage);
export const qsRevealSinksButton = Variable(config.qs.qsRevealSinksButton);
export const qsRevealSinksSpacing = config.qs.qsRevealSinksSpacing;
export const qsRevealScreenRecord = Variable(config.qs.qsRevealScreenRecord);
export const qsRevealScreenRecordSpacing = config.qs.qsRevealScreenRecordSpacing;
export const qsRevealScreenshot = Variable(config.qs.qsRevealScreenshot);
export const qsRevealScreenshotSpacing = config.qs.qsRevealScreenshotSpacing;
export const qsRevealLightstrip = Variable(config.qs.qsRevealLightstrip);
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
export const weatherWidth = Variable(config.weather.weatherWidth);
export const weatherBoxTopMargin = config.weather.weatherBoxTopMargin;
export const weatherContentWidth = config.weather.weatherContentWidth;

// screen record
export const recordInternalAudioToggle = Variable(config.screenRecord.recordInternalAudioToggle);
export const recordOnlySelectedScreenToggle = Variable(config.screenRecord.recordOnlySelectedScreenToggle);
export const recordSaveDateFormat = config.screenRecord.recordSaveDateFormat;
export const recordScreenrecordsDir = config.screenRecord.recordScreenrecordsDir;
export const recordScreenshotsDir = config.screenRecord.recordScreenshotsDir;

// dashboard
export const enableDashboard = config.dashboard.enableDashboard;
export const namespaceDashboard = config.dashboard.namespaceDashboard;
export const dashboardWidth = Variable(config.dashboard.dashboardWidth);
export const dashboardBoxTopMargin = config.dashboard.dashboardBoxTopMargin;
export const dashboardContentWidth = config.dashboard.dashboardContentWidth;

// applauncher
export const namespaceApplauncher = config.applauncher.namespaceApplauncher;
export const applauncherWidth = Variable(config.applauncher.applauncherWidth);
export const applauncherBoxTopMargin = config.applauncher.applauncherBoxTopMargin;
export const applauncherContentWidth = config.applauncher.applauncherContentWidth;
export const applauncherScrollableHeight = config.applauncher.applauncherScrollableHeight;
export const applauncherSingleItemHeight = config.applauncher.applauncherSingleItemHeight;

// notification popup window
export const enableNotificationPopups = config.notificationPopupWindow.enableNotificationPopups;
export const removeAllPreviousNotificationOnStart = config.notificationPopupWindow.removeAllPreviousNotificationOnStart;
export const namespaceNotification = config.notificationPopupWindow.namespaceNotification;
export const notificationWidth = Variable(config.notificationPopupWindow.notificationWidth);
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
export const overviewWidth = Variable(config.overview.overviewWidth);
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
        qsRevealScreenRecord.set(false);
    }

    if (str !== "screenshot") {
        qsRevealScreenshot.set(false);
    }

    if (str !== "lightstrip") {
        qsRevealLightstrip.set(false);
    }

    if (str !== "sinks") {
        qsRevealSinksButton.set(false);
    }
}

export function qsToggleRevealer(str: string) {
    switch (str) {
        case "screen-record":
            qsRevealScreenRecord.set(!qsRevealScreenRecord.get());
            break;
        case "screenshot":
            qsRevealScreenshot.set(!qsRevealScreenshot.get());
            break;
        case "lightstrip":
            qsRevealLightstrip.set(!qsRevealLightstrip.get());
            break;
        case "sinks":
            qsRevealSinksButton.set(!qsRevealSinksButton.get());
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
