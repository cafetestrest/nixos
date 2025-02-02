import { Gtk } from "astal/gtk4";
import { bind } from "astal";
import icons from "../../../lib/icons";
import BrightnessService from "../../../service/Brightness";

export default () => {
	if (BrightnessService)
		return (
			<box cssClasses={["brightness-box"]}>
				<overlay
					cssClasses={["control-center__volume-slider", "brightness"]}
					child={
						<slider
							draw_value={false}
							hexpand={true}
							onDragged={({ value }) =>
								(BrightnessService!.screen = value)
							}
							value={bind(BrightnessService).as((b) => b.screen)}
						/>
					}
					overlay={
						<image
							cssClasses={["control-center__slider-icon"]}
							iconName={icons.brightness.screen}
							hexpand={false}
							halign={Gtk.Align.START}
						/>
					}
				/>
			</box>
		);
};
