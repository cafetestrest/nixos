import { App, Gtk, Astal, Gdk } from "astal/gtk4";
import { bind, Variable } from "astal";
import Main from "./pages/Main";
import Network from "./pages/Network";
import Bluetooth from "./pages/Bluetooth";
import { spacing } from "../../lib/variables";
import PopupWindow from "../../common/PopupWindow";
import { toggleWindow } from "../../lib/utils";
import { revealSinks } from "./items/Volume";
import { revealScreenShot } from "./items/ScreenshotMenu";
import { revealLightstripColor } from "./items/LightstripColor";
import { revealScreenRecord } from "./pages/Main";

export const namespace = "control-center";
export const controlCenterPage = Variable("main");

export default () => {
	return (
		<PopupWindow
			valign={Gtk.Align.START}
			scrimType="transparent"
			visible={false}
			margin={12}
			name={namespace}
			namespace={namespace}
			className="ControlCenter"
			layer={Astal.Layer.OVERLAY}
			exclusivity={Astal.Exclusivity.EXCLUSIVE}
			keymode={Astal.Keymode.EXCLUSIVE}
			anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
			application={App}
			onKeyPressed={(_, keyval) => {
				if (keyval === Gdk.KEY_Escape) {
					let changed = false;

					if (revealSinks.get()) {
						revealSinks.set(false);
						changed = true;
					}

					if (revealScreenShot.get()) {
						revealScreenShot.set(false);
						changed = true;
					}

					if (revealLightstripColor.get()) {
						revealLightstripColor.set(false);
						changed = true;
					}

					if (revealScreenRecord.get()) {
						revealScreenRecord.set(false);
						changed = true;
					}

					if (false === changed) {
						if (controlCenterPage.get() == "main") {
							toggleWindow(namespace);
						} else {
							controlCenterPage.set("main");
						}
					}
				}
			}}
		>
			<box
				cssClasses={[namespace]}
				vertical
				spacing={spacing}
				valign={Gtk.Align.START}
			>
				<box
					cssClasses={["control-center-out"]}
				>
					<box
						cssClasses={["control-center__container"]}
						valign={Gtk.Align.START}
					>
						<stack
							visibleChildName={bind(controlCenterPage)}
							transitionType={
								Gtk.StackTransitionType.SLIDE_LEFT_RIGHT
							}
							transitionDuration={200}
						>
							<Main />
							{Network()}
							{Bluetooth()}
						</stack>
					</box>
				</box>
			</box>
		</PopupWindow>
	);
};
