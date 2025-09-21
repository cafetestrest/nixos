import { Gtk } from "ags/gtk3";
import icons from "../../../lib/icons";
import {
	qsRevealScreenRecord,
	setQsRevealScreenRecord,
	recordInternalAudioToggle,
	recordOnlySelectedScreenToggle,
	config
} from "../../../lib/config";
import ScreenRecordService from "../../../service/ScreenRecordService";

export default () => {
	return (
		<revealer
			transitionType={Gtk.RevealerTransitionType.SLIDE_DOWN}
			revealChild={qsRevealScreenRecord}
		>
			<box class={`menu screen-record`} vertical={true} >
				<ScreenRecordMenu />
			</box>
		</revealer>
	);
}

const ScreenRecordMenu = () => {
	return (
		<box
            vertical={true}
			spacing={config.quicksettings.revealScreenRecordSpacing}
		>
			<icon
				icon={icons.record}
				class={"qs-menu-icon-record"}
			/>
             <label
                 label={"Start recording?"}
                 class={"qs-menu-label"}
             />
			 <box
	            vertical={true}
				class={"qs-menu-screen-record-content"}
			 >
				<box>
					<icon icon={icons.audio.mic.high} />
					<label label={"Record audio"} />
					<switch
						hexpand={true}
						halign={Gtk.Align.END}
						active={false}
						$={(self) => {
							self.connect('notify::active', () => {
								ScreenRecordService.setAudioRecord(self.active)
							});

							recordInternalAudioToggle(v => self.active = false);
						}}
					/>
				</box>
				<box>
					<icon icon={icons.select} />
					<label label={"Record only selected size"} />
					<switch
						hexpand={true}
						halign={Gtk.Align.END}
						active={false}
						$={(self) => {
							self.connect('notify::active', () => {
								ScreenRecordService.setRecordSelected(self.active)
							});

							recordOnlySelectedScreenToggle(v => self.active = false);
						}}
					/>
				</box>
			</box>
			<box
				spacing={config.quicksettings.revealScreenRecordSpacing * 0.5}
				hexpand={true}
				halign={Gtk.Align.END}
			>
				<button
					class={`menu-button outlined`}
					focusOnClick={false}
					onClicked={() => setQsRevealScreenRecord(false)}
				>
					<label label={"Cancel"}/>
				</button>
				<button
					class={`menu-button filled`}
					focusOnClick={false}
					onClicked={() => {
						setQsRevealScreenRecord(false);
						ScreenRecordService.start();
					}}
				>
					<label label={"Start"}/>
				</button>
			</box>
		</box>
	);
};
