import icons from "../../../lib/icons";
import QSToggle from "./QSToggle";
import { qsRevealScreenRecord, setQsRevealScreenRecord } from "../../common/Variables";

export default () => {
    return (
        <QSToggle
            className={qsRevealScreenRecord.as((p) => {
                if (p) {
                    return "toggles control-center-button active";
                }
                return "toggles control-center-button";
            })}
            onPrimaryClick={() => setQsRevealScreenRecord(!qsRevealScreenRecord.get())}
            icon={icons.record}
            label={"Screen record"}
            hasArrow={true}
            arrowIcon={qsRevealScreenRecord.as((p) => {
                if (p) {
                    return icons.ui.arrow.down;
                }
                return icons.ui.arrow.right;
            })}
            revelaer="screen-record"
        />
    );
}
