import { Astal, Gtk } from "ags/gtk3";
import icons from "../../../lib/icons";
import ScreenRecordService from "../../../service/ScreenRecordService";
import { enableBarRecordingIndicator } from "../../common/Variables";
import { createBinding, createState } from "ags";

export default () => {
    if (enableBarRecordingIndicator === false) {
        return (
            <box visible={false} />
        );
    }

	const [revealTimer, setRevealTimer] = createState(false);

    return <box class={"recording-box"}>
        <button
            class={"recording-indicator-button bar-button"}
            onClicked={() => ScreenRecordService.stop()}
            onHover={(self) => {
                setRevealTimer(true);
                Astal.widget_toggle_class_name(self, "spacing", true);
            }}
            onHoverLost={(self) => {
                setRevealTimer(false);
                Astal.widget_toggle_class_name(self, "spacing", false);
            }}
            visible={createBinding(ScreenRecordService, "recording")}
        >
            <box>
                <revealer
                    transitionDuration={300}
                    transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}
                    revealChild={revealTimer}
                >
                    <label
                        label={createBinding(ScreenRecordService, "timer").as(
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
