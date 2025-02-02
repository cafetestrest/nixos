import { bind, Variable } from "astal";
import { Gtk } from "astal/gtk4";
import icons from "../../../lib/icons";
import ScreenRecordService from "../../../service/ScreenRecord";
import BarButton from "../BarButton";

const RecordingIndicator = () => {
	const revealTimer = Variable(false);
	return (
		<revealer
			transitionType={Gtk.RevealerTransitionType.CROSSFADE}
			transitionDuration={300}
			revealChild={bind(ScreenRecordService, "recording").as(Boolean)}
		>
			<BarButton
				className="bar__recording-indicator"
				onClicked={() => ScreenRecordService.stop()}
				onHoverEnter={(self) => {
					revealTimer.set(true);
					if (!self.has_css_class("spacing")) {
						self.add_css_class("spacing")
					}
				}}
				onHoverLeave={(self) => {
					revealTimer.set(false);
					if (self.has_css_class("spacing")) {
						self.remove_css_class("spacing")
					}
				}}
			>
				<box halign={Gtk.Align.CENTER}>
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
			</BarButton>
		</revealer>
	);
};

export default RecordingIndicator;
