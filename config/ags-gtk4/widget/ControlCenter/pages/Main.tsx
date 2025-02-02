import { Gdk, Gtk } from "astal/gtk4";
import { bind, Variable } from "astal";
// import { spacing, uptime } from "../../../lib/variables";
import NetworkButton from "../items/Network";
import Volume, { SinkRevealer, revealSinks } from "../items/Volume";
import DND from "../items/DND";
import Microphone from "../items/Microphone";
import icons from "../../../lib/icons";
import Brightness from "../items/Brightness";
import ScreenRecord from "../items/ScreenRecord";
// import ColorScheme from "../items/ColorScheme";
import ScreenRecordMenu from "../items/ScreenRecordMenu";
import ScreenRecordService from "../../../service/ScreenRecord";
import BluetoothButton from "../items/Bluetooth";
// import { toggleWindow } from "../../../lib/utils";
// import { namespace } from "../../Powermenu";
import NightLight from "../items/NightLight";
import Idle from "../items/Idle";
import { Tooltip } from "../../Dashboard/weather";
import Media from "../items/Media";
import ControlCenterButton from "../ControlCenterButton";
import ScreenshotMenu, { revealScreenShot } from "../items/ScreenshotMenu";
import LightstripColor, { revealLightstripColor } from "../items/LightstripColor";

export const revealScreenRecord = Variable(false);
export const revealFristPage = Variable(true);
export const revealSecondPage = Variable(false);

export const SinkButton = () => (
	<button
		cssClasses={["control-center__powermenu-button", "sink"]}
		onClicked={() => {
			revealScreenRecord.set(false);
			revealScreenShot.set(false);
			revealLightstripColor.set(false);
			revealSinks.set(!revealSinks.get())
		}}
		onKeyPressed={(_, keyval) => {
			if (keyval === Gdk.KEY_Return || keyval === Gdk.KEY_space || keyval === Gdk.KEY_KP_Enter) {
				revealScreenRecord.set(false);
				revealScreenShot.set(false);
				revealLightstripColor.set(false);
				revealSinks.set(!revealSinks.get())
			}
		}}
	>
		<image
			iconName={bind(revealSinks).as((v) => true === v ? icons.ui.arrow.up : icons.ui.arrow.right)}
		/>
	</button>
);

export const FirstPage = () => (
	<box vertical>
		<box>
			<BluetoothButton />
			<box cssClasses={["control-center-space"]} />
			<NightLight />
		</box>

		<box cssClasses={["control-center-box-space"]} />

		<box>
			<Microphone />
			<box cssClasses={["control-center-space"]} />
			<DND />
		</box>

		<box cssClasses={["control-center-box-space"]} />

		<box>
			<Idle />
			<box cssClasses={["control-center-space"]} />
			<ScreenRecord
				onClicked={() => {
					revealSinks.set(false);
					revealLightstripColor.set(false);
					revealScreenShot.set(false);

					if (ScreenRecordService.recording) {
						ScreenRecordService.stop();
					} else {
						revealScreenRecord.set(!revealScreenRecord.get());
					}
				}}
			/>
		</box>

		<ScreenRecordMenu
			revealMenu={revealScreenRecord}
			closeMenu={() =>
				revealScreenRecord.set(!revealScreenRecord.get())
			}
		/>
	</box>
);

export const SecondPage = () => (
	<box vertical cssClasses={["second-page"]}>
		<box>
			<NetworkButton />
			<box cssClasses={["control-center-space"]} />
			<ControlCenterButton
				className="screenshot-button"
				icon={icons.screenshot}
				label={"Screenshot"}
				onClicked={() => {
					revealSinks.set(false);
					revealScreenRecord.set(false);
					revealLightstripColor.set(false);
					revealScreenShot.set(!revealScreenShot.get())
				}}
				menuName="arrow"
			/>
		</box>

		<ScreenshotMenu
			revealMenu={revealScreenShot}
			closeMenu={() =>
				revealScreenShot.set(!revealScreenShot.get())
			}
		/>

		<box cssClasses={["control-center-box-space"]} />

		<box>
			<ControlCenterButton
				className="lightstrip-color-button"
				icon={icons.brightness.indicator}
				label={"Lightstrip"}
				onClicked={() => {
					revealSinks.set(false);
					revealScreenRecord.set(false);
					revealScreenShot.set(false);
					revealLightstripColor.set(!revealLightstripColor.get())
				}}
				menuName="arrow"
			/>
			<box cssClasses={["control-center-space"]} />
			<box hexpand cssClasses={["filler-button", "toggles"]} />
		</box>

		<LightstripColor
			revealMenu={revealLightstripColor}
			closeMenu={() =>
				revealLightstripColor.set(!revealLightstripColor.get())
			}
		/>
	</box>
);

export default () => {
	return (
		<box
			name="main"
			cssClasses={["control-center__page", "main"]}
			vertical
			// spacing={spacing}
		>
			<box cssClasses={["control-center-toggles"]}>
				<revealer
					cssClasses={["page-revealer", "first-revealer"]}
					revealChild={bind(revealFristPage)}
					visible={bind(revealFristPage)}
					transition_duration={300}
					transitionType={Gtk.RevealerTransitionType.SLIDE_LEFT}
				>
					<FirstPage />
				</revealer>

				<revealer
					cssClasses={["page-revealer", "second-revealer"]}
					revealChild={bind(revealSecondPage)}
					visible={bind(revealSecondPage)}
					transition_duration={300}
					transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}
				>
					<SecondPage />
				</revealer>
			</box>

			<box halign={Gtk.Align.CENTER} cssClasses={["control-center-page-indicators"]}>
				<button
					cssClasses={bind(revealFristPage).as((r) => {
						if (r)
							return ["control-center-page", "active"]
						return ["control-center-page"]
					})}
					onClicked={() =>{
						revealScreenRecord.set(false);
						revealScreenShot.set(false);
						revealLightstripColor.set(false);
						revealSinks.set(false)
						revealFristPage.set(true)
						revealSecondPage.set(false)
					}}
					onKeyPressed={(_, keyval) => {
						if (keyval === Gdk.KEY_Return || keyval === Gdk.KEY_space || keyval === Gdk.KEY_KP_Enter) {
							revealScreenRecord.set(false);
							revealScreenShot.set(false);
							revealLightstripColor.set(false);
							revealSinks.set(false)
							revealFristPage.set(true)
							revealSecondPage.set(false)
						}
					}}
				>
					<box cssClasses={["page-dot"]} />
				</button>
				<button
					cssClasses={bind(revealSecondPage).as((r) => {
						if (r)
							return ["control-center-page", "active"]
						return ["control-center-page"]
					})}
					onClicked={() =>{
						revealScreenRecord.set(false);
						revealScreenShot.set(false);
						revealLightstripColor.set(false);
						revealSinks.set(false)
						revealFristPage.set(false)
						revealSecondPage.set(true)
					}}
					onKeyPressed={(_, keyval) => {
						if (keyval === Gdk.KEY_Return || keyval === Gdk.KEY_space || keyval === Gdk.KEY_KP_Enter) {
							revealScreenRecord.set(false);
							revealScreenShot.set(false);
							revealLightstripColor.set(false);
							revealSinks.set(false)
							revealFristPage.set(false)
							revealSecondPage.set(true)
						}
					}}
				>
					<box cssClasses={["page-dot"]} />
				</button>
			</box>

			<box cssClasses={["qsvolume-box"]}>
				<Volume valign={Gtk.Align.CENTER}/>
				<box cssClasses={["control-center-space"]} />
				<SinkButton />
			</box>
			<SinkRevealer />
			{Brightness()}

			{/* <box spacing={16} cssClasses={["control-center__footer"]}>
				<button
					cssClasses={["control-center__powermenu-button"]}
					onClicked={() => toggleWindow(namespace)}
				>
					<image iconName={icons.powermenu.shutdown} iconSize={16} />
				</button>
				<box hexpand />
				<label
					cssClasses={["control-center__time-to-empty"]}
					label={bind(uptime)}
				/>
			</box> */}
			<box cssClasses={["control-center-box-space"]} />
			<Tooltip total={5} />
			<Media />
		</box>
	);
};

export const Menu = ({ name, bindVariable, content }: {name: string, bindVariable: Variable<boolean> , content: Gtk.Widget[] }) => (
	<revealer
		transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
		revealChild={bind(bindVariable)}
	>
		<box cssClasses={["menu", `${name}`]} vertical children={content} />
	</revealer>
);
