import icons from "../../../lib/icons";
import QSToggle from "./QSToggle";
import { bash } from "../../../lib/utils";
import { setVisibleQSMainPage, commandOpenNote } from "../../common/Variables";

export default () => {
    return (
        <QSToggle
            className={"toggles control-center-button"}
            onPrimaryClick={() => {
                setVisibleQSMainPage(false);

                bash(commandOpenNote)
            }}
            icon={icons.note}
            label={"Open Note"}
            hasArrow={false}
        />
    );
}
