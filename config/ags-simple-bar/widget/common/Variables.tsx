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
export const applauncherWidth = Variable(1000);
export const applauncherBoxTopMargin = 100;
export const applauncherContentWidth = 500;
export const applauncherScrollableHeight = 500;

// osd
export const osdLevelbarWidth = 100;
