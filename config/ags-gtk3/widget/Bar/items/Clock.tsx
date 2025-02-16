import { GLib, Variable } from "astal";
import { App } from "astal/gtk3";
import BarButton from "../BarButton";
import { toggleWindow } from "../../../lib/utils";
import { namespace } from "../../Dashboard";

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
				toggleWindow(namespace);
			}}
			setup={(self) => {
				const window = App.get_window(namespace);
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
