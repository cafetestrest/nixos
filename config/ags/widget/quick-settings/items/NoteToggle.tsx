import icons from "../../../lib/icons";
import QSToggle from "./QSToggle";
import { bash } from "../../../lib/utils";
import { setVisibleQSMainPage, config } from "../../../lib/config";

export default () => {
    return (
        <QSToggle
            className={"toggles quick-settings-button"}
            onPrimaryClick={() => {
                setVisibleQSMainPage(false);

                bash(config.common.commandOpenNote)
            }}
            icon={icons.note}
            label={"Open Note"}
            hasArrow={false}
        />
    );
}
