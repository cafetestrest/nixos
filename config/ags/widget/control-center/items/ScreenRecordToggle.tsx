import { bind } from "astal";
import icons from "../../../lib/icons";
import QSToggle from "./QSToggle";
import { qsRevealScreenRecord } from "../../common/Variables";

export default () => {
    return (
        <QSToggle
            className={bind(qsRevealScreenRecord).as((p) => {
                if (p) {
                    return "toggles control-center-button active";
                }
                return "toggles control-center-button";
            })}
            onPrimaryClick={() => qsRevealScreenRecord.set(!qsRevealScreenRecord.get())}
            icon={icons.record}
            label={"Screen record"}
            hasArrow={true}
            revelaer="screen-record"
        />
    );
}
