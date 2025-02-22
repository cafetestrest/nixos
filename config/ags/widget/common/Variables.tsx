import { Variable } from "astal";

// bar
export const visiblePowermenu = Variable(false);
export const visibleQSMainPage = Variable(false);

// usage
export const barUsageSpacing = 10;
export const diskUsageSpacing = 12;
export const diskUsagePoolRate = 600000;
export const ramUsageSpacing = 12;
export const ramUsageDecimals = 1;
export const ramUsagePoolRate = 2000;
export const cpuUsageSpacing = 12;
export const cpuUsagePoolRate = 2000;
export const cpuUsageDecimals = 1;

// qs
export const qsTogglesPage = Variable("qs-page-first");
export const qsPage = Variable("main");
export const qsRevealSinksButton = Variable(false);
export const qsRevealSinksSpacing = 16;
export const qsRevealScreenRecord = Variable(false);
export const qsRevealScreenRecordSpacing = 16;
export const qsRevealScreenshot = Variable(false);
export const qsRevealScreenshotSpacing = 16;
export const qsRevealLightstrip = Variable(false);
export const qsRevealLightstripSpacing = 16;

// weather
export const namespaceWeather = "weather";
export const qsWeatherScheduleDays = 5;
export const weatherWidth = Variable(1000);
export const weatherBoxTopMargin = 35;
export const weatherContentWidth = 200;

// screen record
export const recordInternalAudioToggle = Variable(false);
export const recordOnlySelectedScreenToggle = Variable(false);
export const recordSaveDateFormat = "%Y-%m-%d_%H-%M-%S";
export const recordScreenrecordsDir = "/Videos/Screenrecords";
export const recordScreenshotsDir = "/Pictures/Screenshots";

// dashboard
export const namespaceDashboard = "dashboard";
export const dashboardWidth = Variable(1000);
export const dashboardBoxTopMargin = 35;
export const dashboardContentWidth = 200;

// applauncher
export const namespaceApplauncher = "launcher";
export const applauncherWidth = Variable(1000);
export const applauncherBoxTopMargin = 800;
export const applauncherContentWidth = 500;
export const applauncherScrollableHeight = 370;
export const applauncherSingleItemHeight = 50;

// notification popup window
export const removeAllPreviousNotificationOnStart = true;
export const namespaceNotification = "notification";
export const notificationWidth = Variable(1000);
export const notificationBoxTopMargin = 35;
export const notificationContentWidth = 450;
export const notificationScrollableMaxHeight = 500;
export const notificationHeight = 400;
export const notificationContentHeight = 60;
export const notificationSpacing = 10;

// overview
export const namespaceOverview = "overview";
export const workspaces = 10;
export const overviewWidth = Variable(1000);
export const overviewBoxTopMargin = 35;
export const overviewContentWidth = 200;
export const overviewScale = 0.06;

// osd
export const osdLevelbarWidth = 100;

// wifi
export const hasWifi = false;

// brightness
export const hasBrightness = false;

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
