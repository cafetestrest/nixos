import { App, Astal, Gdk } from "astal/gtk4";
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
			onKeyPressed={(_, keyval) => {
				if (keyval === Gdk.KEY_Escape) {
					App.toggle_window(namespace);
				}
			}}
		>
			<box cssClasses={[namespace]} vertical spacing={10}>
				{Calendar()}
				{Todos()}
			</box>
		</PopupWindow>
	);
};
