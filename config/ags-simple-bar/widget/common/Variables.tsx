import { Variable } from "astal"

// bar
export const visiblePowermenu = Variable(false);
export const visibleQSMainPage = Variable(false);

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
export const qsWeatherScheduleDays = 5;

// screen record
export const recordInternalAudioToggle = Variable(false);
export const recordOnlySelectedScreenToggle = Variable(false);
export const recordSaveDateFormat = "%Y-%m-%d_%H-%M-%S";
export const recordScreenrecordsDir = "/Videos/Screenrecords";
export const recordScreenshotsDir = "/Pictures/Screenshots";

// dashboard
export const dashboardWidth = Variable(1000);
export const dashboardBoxTopMargin = 35;
export const dashboardContentWidth = 200;

// applauncher
export const namespaceApplauncher = "launcher";
export const applauncherWidth = Variable(1000);
export const applauncherBoxTopMargin = 900;
export const applauncherContentWidth = 500;
export const applauncherScrollableHeight = 370;
export const applauncherSingleItemHeight = 50;

// osd
export const osdLevelbarWidth = 100;

// wifi
export const hasWifi = false;

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
