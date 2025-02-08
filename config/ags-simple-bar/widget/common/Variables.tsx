import { Variable } from "astal"

// bar
export const visiblePowermenu = Variable(false);
export const visibleQSMainPage = Variable(false);

// qs
export const qsTogglesPage = Variable("qs-page-first");
export const qsPage = Variable("main");

export const referenceWord = "Do not disturb";
export const padLength = (reference: string, word: string): string => {
    return word.padEnd(reference.length + 6, " ");//todo check
};
