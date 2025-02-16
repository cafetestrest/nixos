import { App, Astal, Gdk } from "astal/gtk3";
import PopupWindow from "../../common/PopupWindow";
import Todos from "./items/Todos";
import Calendar from "./items/Calendar";

export const namespace = "dashboard";

export default () => {
	return (
		<PopupWindow
			name={namespace}
			namespace={namespace}
			scrimType="transparent"
			anchor={Astal.WindowAnchor.TOP}
			marginTop={12}
			layer={Astal.Layer.OVERLAY}
			exclusivity={Astal.Exclusivity.NORMAL}
			keymode={Astal.Keymode.EXCLUSIVE}
			onKeyPressEvent={(self, event) => {
				if (event.get_keyval()[1] === Gdk.KEY_Escape) {
					App.toggle_window(self.name);
				}
			}}
		>
			<box className={namespace} vertical spacing={10}>
				{Calendar()}
				{Todos()}
			</box>
		</PopupWindow>
	);
};
