import { App, Astal, hook } from "astal/gtk4";
import { activePopupWindows, toggleWindow } from "../../lib/utils";

export const namespace = "transparent-scrim";

export default () => (
	<window
		visible={false}
		name={namespace}
		namespace={namespace}
		layer={Astal.Layer.OVERLAY}
		exclusivity={Astal.Exclusivity.IGNORE}
		anchor={
			Astal.WindowAnchor.TOP |
			Astal.WindowAnchor.LEFT |
			Astal.WindowAnchor.RIGHT |
			Astal.WindowAnchor.BOTTOM
		}
		keymode={Astal.Keymode.NONE}
		application={App}
		cssClasses={[namespace]}
		setup={(self) => {
			hook(self, self, "notify::visible", () => {
				if (!self.visible) {
					const visiblePopups = activePopupWindows("transparent");
					visiblePopups.forEach((popup) => {
						toggleWindow(popup.name);
					});
				}
			});
		}}
	>
		<box
			vexpand={true}
			hexpand={true}
			onClicked={(self) => {
				self.parent.visible = false;
			}}
		/>
	</window>
);
