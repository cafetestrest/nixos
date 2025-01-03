import { Gtk } from "astal/gtk3";
import { bind, Variable } from "astal";
// import { spacing, uptime } from "../../../lib/variables";
import NetworkButton from "../items/Network";
import Volume, { SinkRevealer, revealSinks } from "../items/Volume";
import DND from "../items/DND";
import Microphone from "../items/Microphone";
import icons from "../../../lib/icons";
// import Brightness from "../items/Brightness";
import ScreenRecord from "../items/ScreenRecord";
// import ColorScheme from "../items/ColorScheme";
import ScreenRecordMenu from "../items/ScreenRecordMenu";
import ScreenRecordService from "../../../service/ScreenRecord";
import BluetoothButton from "../items/Bluetooth";
// import { toggleWindow } from "../../../lib/utils";
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
		className={"control-center__powermenu-button sink"}
		onClick={() => {
			revealScreenRecord.set(false);
			revealScreenShot.set(false);
			revealLightstripColor.set(false);
			revealSinks.set(!revealSinks.get())
		}}
		onKeyReleaseEvent={(_, event) => {
			const [keyEvent, keyCode] = event.get_keycode();

			if (keyEvent && (keyCode === 36 || keyCode === 65 || keyCode === 104)) { //65:space, 36:return, 104:num return
				revealScreenRecord.set(false);
				revealScreenShot.set(false);
				revealLightstripColor.set(false);
				revealSinks.set(!revealSinks.get())
			}
		}}
	>
		<icon
			icon={bind(revealSinks).as((v) => true === v ? icons.ui.arrow.up : icons.ui.arrow.right)}
		/>
	</button>
);

export default () => {
	return (
		<box
			name="main"
			className="control-center__page main"
			vertical
			// spacing={spacing}
		>
			<box className={"control-center-toggles"}>
				<revealer
					className={"page-revealer first-revealer"}
					revealChild={bind(revealFristPage)}
					visible={bind(revealFristPage)}
					transition_duration={300}
					transitionType={Gtk.RevealerTransitionType.SLIDE_LEFT}
				>
					<box vertical>
						<box>
							<BluetoothButton />
							<box className={"control-center-space"} />
							<NightLight />
						</box>

						<box className={"control-center-box-space"} />

						<box>
							<Microphone />
							<box className={"control-center-space"} />
							<DND />
						</box>

						<box className={"control-center-box-space"} />

						<box>
							<Idle />
							<box className={"control-center-space"} />
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
				</revealer>

				<revealer
					className={"page-revealer second-revealer"}
					revealChild={bind(revealSecondPage)}
					visible={bind(revealSecondPage)}
					transition_duration={300}
					transitionType={Gtk.RevealerTransitionType.SLIDE_RIGHT}
				>
					<box vertical>
						<box>
							<NetworkButton />
							<box className={"control-center-space"} />
							<ControlCenterButton
								className={"screenshot-button toggles"}
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

						<box className={"control-center-box-space"} />

						<box>
							{/* {Brightness()} */}
							<ControlCenterButton
								className={"lightstrip-color-button toggles"}
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
							<box className={"control-center-space"} />
							<box hexpand className={"filler-button toggles"} />
						</box>

						<LightstripColor
							revealMenu={revealLightstripColor}
							closeMenu={() =>
								revealLightstripColor.set(!revealLightstripColor.get())
							}
						/>
					</box>
				</revealer>
			</box>

			<box halign={Gtk.Align.CENTER} className={"control-center-page-indicators"}>
				<button
					className={bind(revealFristPage).as((r) => {
						if (r)
							return "control-center-page active"
						return "control-center-page"
					})}
					onClick={() =>{
						revealScreenRecord.set(false);
						revealScreenShot.set(false);
						revealLightstripColor.set(false);
						revealSinks.set(false)
						revealFristPage.set(true)
						revealSecondPage.set(false)
					}}
					onKeyReleaseEvent={(_, event) => {
						const [keyEvent, keyCode] = event.get_keycode();
		
						if (keyEvent && (keyCode === 36 || keyCode === 65 || keyCode === 104)) { //65:space, 36:return, 104:num return
							revealScreenRecord.set(false);
							revealScreenShot.set(false);
							revealLightstripColor.set(false);
							revealSinks.set(false)
							revealFristPage.set(true)
							revealSecondPage.set(false)
						}
					}}
				>
					<box className={"page-dot"} />
				</button>
				<button
					className={bind(revealSecondPage).as((r) => {
						if (r)
							return "control-center-page active"
						return "control-center-page"
					})}
					onClick={() =>{
						revealScreenRecord.set(false);
						revealScreenShot.set(false);
						revealLightstripColor.set(false);
						revealSinks.set(false)
						revealFristPage.set(false)
						revealSecondPage.set(true)
					}}
					onKeyReleaseEvent={(_, event) => {
						const [keyEvent, keyCode] = event.get_keycode();
		
						if (keyEvent && (keyCode === 36 || keyCode === 65 || keyCode === 104)) { //65:space, 36:return, 104:num return
							revealScreenRecord.set(false);
							revealScreenShot.set(false);
							revealLightstripColor.set(false);
							revealSinks.set(false)
							revealFristPage.set(false)
							revealSecondPage.set(true)
						}
					}}
				>
					<box className={"page-dot"} />
				</button>
			</box>

			<box className={"qsvolume-box"}>
				<Volume valign={Gtk.Align.CENTER}/>
				<box className={"control-center-space"} />
				<SinkButton />
			</box>
			<SinkRevealer />

			{/* <box spacing={16} className="control-center__footer">
				<button
					className="control-center__powermenu-button"
					onClick={() => toggleWindow("powermenu")}
				>
					<icon icon={icons.powermenu.shutdown} iconSize={16} />
				</button>
				<box hexpand />
				<label
					className="control-center__time-to-empty"
					label={bind(uptime)}
				/>
			</box> */}
			<box className={"control-center-box-space"} />
			< Tooltip total={5} />
			<Media />
		</box>
	);
};

export const Menu = ({ name, bindVariable, content }: {name: string, bindVariable: Variable<boolean> , content: Gtk.Widget[] }) => (
	<revealer
		transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
		revealChild={bind(bindVariable)}
	>
		<box className={`menu ${name}`} vertical children={content} />
	</revealer>
);
