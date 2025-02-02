import { GLib, Variable } from "astal";
import { App, hook } from "astal/gtk4";
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
			className="clock-bar"
			onClicked={() => {
				toggleWindow(namespace);
			}}
			setup={(self) => {
				const window = App.get_window(namespace);
				if (window) {
					hook(self, window, "notify::visible", () => {
						if (window.visible) {
							self.add_css_class("active")
						} else {
							self.remove_css_class("active")
						}
					});
				}
			}}
		>
			<label
				cssClasses={["Time"]}
				onDestroy={() => time.drop()}
				label={time()}
			/>
		</BarButton>
	);
};
