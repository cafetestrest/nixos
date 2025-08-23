import { Gtk } from "ags/gtk3";
import icons from "../../../lib/icons";
import QSMenu, { MenuButton } from "./QSMenu";
import {
	qsRevealScreenRecord,
	setQsRevealScreenRecord,
	qsRevealScreenRecordSpacing,
	recordInternalAudioToggle,
	recordOnlySelectedScreenToggle
} from "../../common/Variables";
import ScreenRecordService from "../../../service/ScreenRecordService";

export default () => {
	return (
		<QSMenu
			classname={"screen-record"}
			bindVariable={qsRevealScreenRecord}
			content={[
				<ScreenRecordMenu />
			]}
		/>
	);
}

const ScreenRecordMenu = () => {
	return (
		<box
            vertical={true}
			spacing={qsRevealScreenRecordSpacing}
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

							// self.hook(recordInternalAudioToggle, () => {
							// 	self.active = false;
							// })//todo
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

							// self.hook(recordOnlySelectedScreenToggle, () => {
							// 	self.active = false;
							// })//todo
						}}
					/>
				</box>
			</box>
			<box
				spacing={qsRevealScreenRecordSpacing * 0.5}
				hexpand={true}
				halign={Gtk.Align.END}
			>
				<MenuButton buttonType="outlined" onClicked={() => setQsRevealScreenRecord(false)}>
					<label label={"Cancel"}/>
				</MenuButton>
				<MenuButton
					onClicked={() => {
						setQsRevealScreenRecord(false);
						ScreenRecordService.start();
					}}
				>
					<label label={"Start"}/>
				</MenuButton>
			</box>
		</box>
	);
};
