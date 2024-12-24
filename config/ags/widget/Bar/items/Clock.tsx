import { GLib, Variable } from "astal";
import { App } from "astal/gtk3";
import BarButton from "../BarButton";
import { toggleWindow } from "../../../lib/utils";

export default () => {
	const format = '%a %b %e   %H:%M:%S';
	const time = Variable<string>("").poll(
		1000,
		() => GLib.DateTime.new_now_local().format(format)!,
	);
	return (
		<BarButton
			className={"clock-bar"}
			onClicked={() => {
				toggleWindow("dashboard");
			}}
			setup={(self) => {
				const window = App.get_window("dashboard");
				if (window) {
					self.hook(window, "notify::visible", () => {
						self.toggleClassName("active", window.visible);
					});
				}
			}}
		>
			<label
				className="Time"
				onDestroy={() => time.drop()}
				label={time()}
			/>
		</BarButton>
	);
};
