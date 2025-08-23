import icons from "../../../lib/icons";
import { qsRevealSinksButton, setQsRevealSinksButton } from "../../../lib/config";

export default () => {
    return (
        <button
            cssClasses={["qs-sink-button"]}
            onClicked={() => {
                // qsRevertRevealerStatus("sinks");
    			setQsRevealSinksButton(!qsRevealSinksButton.get())
            }}
        >
            <image
                iconName={qsRevealSinksButton.as(a => a ? icons.ui.arrow.up : icons.ui.arrow.down)}
            />
        </button>
    );
}
