import { App, Astal } from "astal/gtk4";
import style from "../style/main.scss";
import Auth from "./items/Auth";
import GLib from "gi://GLib?version=2.0";

// const WALLPAPER = `${GLib.getenv("HOME")}/.cache/current_wallpaper`;
export const namespace = "lockscreen";

const GreeterWindow = () => (
	<window
		namespace={namespace}
		application={App}
		layer={Astal.Layer.OVERLAY}
		name="greeter"
		exclusivity={Astal.Exclusivity.IGNORE}
		cssClasses={[namespace]}
		anchor={
			Astal.WindowAnchor.TOP |
			Astal.WindowAnchor.BOTTOM |
			Astal.WindowAnchor.LEFT |
			Astal.WindowAnchor.RIGHT
		}
		keymode={Astal.Keymode.EXCLUSIVE}
		// setup={() => {
		// 	App.apply_css(`.${namespace} {
		// 		background: url("file://${WALLPAPER}");
		// 		background-size: cover;
		// 	}`);
		// }}
	>
		<Auth />
	</window>
);

function main() {
	GreeterWindow();
}

App.start({
	instanceName: "astal-lockscreen",
	css: style,
	main: main,
});
