import { bind, Variable } from "astal";
import { Gtk } from "astal/gtk3";
import icons from "../../../lib/icons";
import ScreenRecordService from "../../../service/ScreenRecordService";
import { enableBarRecordingIndicator } from "../../common/Variables";

export default () => {
    if (enableBarRecordingIndicator === false) {
        return (
            <box visible={false} />
        );
    }

	const revealTimer = Variable(false);

    return <box className={"recording-box"}>
        <button
            className={"recording-indicator-button bar-button"}
            onClicked={() => ScreenRecordService.stop()}
            onHover={(self) => {
                revealTimer.set(true);
                self.toggleClassName("spacing", true);
            }}
            onHoverLost={(self) => {
                revealTimer.set(false);
                self.toggleClassName("spacing", false);
            }}
            visible={bind(ScreenRecordService, "recording")}
        >
            <box>
                <revealer
                    transitionDuration={300}
                    transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}
                    revealChild={bind(revealTimer)}
                >
                    <label
                        label={bind(ScreenRecordService, "timer").as(
                            (timer) =>
                                new Date(timer * 1000)
                                    .toISOString()
                                    .substring(14, 19),
                        )}
                    />
                </revealer>
                <icon icon={icons.record} />
            </box>
        </button>
    </box>
}
