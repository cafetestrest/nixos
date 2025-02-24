import { Gtk, hook } from "astal/gtk4";
import icons from "../../../lib/icons";
import QSMenu, { MenuButton } from "./QSMenu";
import {
	qsRevealScreenRecord,
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
			<image
				iconName={icons.record}
				cssClasses={["qs-menu-icon"]}
			/>
             <label
                 label={"Start recording?"}
                 cssClasses={["qs-menu-label"]}
             />
			 <box
	            vertical={true}
				cssClasses={["qs-menu-screen-record-content"]}
			 >
				<box>
					<image iconName={icons.audio.mic.high} />
					<label label={"Record audio"} />
					<switch
						hexpand={true}
						halign={Gtk.Align.END}
						active={false}
						setup={(self) => {
							self.connect('notify::active', () => {
								ScreenRecordService.setAudioRecord(self.active)
							});

							hook(self, recordInternalAudioToggle, () => {
								self.active = false;
							})
						}}
					/>
				</box>
				<box>
					<image iconName={icons.select} />
					<label label={"Record only selected size"} />
					<switch
						hexpand={true}
						halign={Gtk.Align.END}
						active={false}
						setup={(self) => {
							self.connect('notify::active', () => {
								ScreenRecordService.setRecordSelected(self.active)
							});

							hook(self, recordOnlySelectedScreenToggle, () => {
								self.active = false;
							})
						}}
					/>
				</box>
			</box>
			<box
				spacing={qsRevealScreenRecordSpacing * 0.5}
				hexpand={true}
				halign={Gtk.Align.END}
			>
				<MenuButton buttonType="outlined" onClicked={() => qsRevealScreenRecord.set(false)}>
					<label label={"Cancel"}/>
				</MenuButton>
				<MenuButton
					onClicked={() => {
						qsRevealScreenRecord.set(false);
						ScreenRecordService.start();
					}}
				>
					<label label={"Start"}/>
				</MenuButton>
			</box>
		</box>
	);
};
