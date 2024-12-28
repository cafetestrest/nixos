import { App, Gtk, Astal } from "astal/gtk3";
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

export const controlCenterPage = Variable("main");

export default () => {
	const pageHeight = bind(controlCenterPage).as((v) => {
		if (v != "main") {
			return `
			min-height: 35.714rem;
			`;
		} else {
			return `
			min-height: 0;`;
		}
	});

	return (
		<PopupWindow
			valign={Gtk.Align.START}
			scrimType="transparent"
			visible={false}
			margin={12}
			name="control-center"
			namespace="control-center"
			className="ControlCenter"
			layer={Astal.Layer.OVERLAY}
			exclusivity={Astal.Exclusivity.EXCLUSIVE}
			keymode={Astal.Keymode.EXCLUSIVE}
			anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
			application={App}
			onKeyPressEvent={(self, event) => {
				const [keyEvent, keyCode] = event.get_keycode();
				if (keyEvent && keyCode == 9) {
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
							toggleWindow(self.name);
						} else {
							controlCenterPage.set("main");
						}
					}
				}
			}}
		>
			<box
				className="control-center"
				vertical
				spacing={spacing}
				valign={Gtk.Align.START}
			>
				<box
					className="control-center-out"
				>
					<box
						className="control-center__container"
						css={pageHeight}
						valign={Gtk.Align.START}
					>
						<stack
							shown={bind(controlCenterPage)}
							transitionType={
								Gtk.StackTransitionType.SLIDE_LEFT_RIGHT
							}
							transitionDuration={200}
							setup={(self) => {
								const NetworkWdgt = Network();
								if (NetworkWdgt) self.add(NetworkWdgt);
							}}
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
