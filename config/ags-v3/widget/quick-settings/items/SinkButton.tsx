import icons from "../../../lib/icons";
import { qsRevealSinksButton } from "../../../lib/config";
import { bind } from "ags/state";

export default () => {
    return (
        <button
            cssClasses={["qs-sink-button"]}
            $clicked={() => {
                // qsRevertRevealerStatus("sinks");
    			qsRevealSinksButton.set(!qsRevealSinksButton.get())
            }}
        >
            <image
                iconName={bind(qsRevealSinksButton).as(a => a ? icons.ui.arrow.up : icons.ui.arrow.down)}
            />
        </button>
    );
}
