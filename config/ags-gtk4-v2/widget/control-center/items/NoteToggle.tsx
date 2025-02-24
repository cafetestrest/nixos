import icons from "../../../lib/icons";
import QSToggle from "./QSToggle";
import { bash } from "../../../lib/utils";
import { visibleQSMainPage, commandOpenNote } from "../../common/Variables";

export default () => {
    return (
        <QSToggle
            cssClasses={["toggles", "control-center-button"]}
            onPrimaryClick={() => {
                visibleQSMainPage.set(false);

                bash(commandOpenNote)
            }}
            icon={icons.note}
            label={"Open Note"}
            hasArrow={false}
        />
    );
}
