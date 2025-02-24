import { bind, Variable } from "astal";
import { Gtk } from "astal/gtk4";
import icons from "../../../lib/icons";
import ScreenRecordService from "../../../service/ScreenRecordService";

export default () => {
	const revealTimer = Variable(false);

    return <button
        cssClasses={["recording-indicator-button", "bar-button"]}
        onClicked={() => ScreenRecordService.stop()}
        onHoverEnter={() => {
            revealTimer.set(true);
        }}
        onHoverLeave={() => {
            revealTimer.set(false);
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
            <image iconName={icons.record} />
        </box>
    </button>
}
