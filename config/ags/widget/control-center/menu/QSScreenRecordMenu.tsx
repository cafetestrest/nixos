import { Gtk } from "astal/gtk3";
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
			<icon
				icon={icons.record}
				className={"qs-menu-icon"}
			/>
             <label
                 label={"Start recording?"}
                 className={"qs-menu-label"}
             />
			 <box
	            vertical={true}
				className={"qs-menu-screen-record-content"}
			 >
				<box>
					<icon icon={icons.audio.mic.high} />
					<label label={"Record audio"} />
					<switch
						hexpand={true}
						halign={Gtk.Align.END}
						active={false}
						setup={(self) => {
							self.connect('notify::active', () => {
								ScreenRecordService.setAudioRecord(self.active)
							});

							self.hook(recordInternalAudioToggle, () => {
								self.active = false;
							})
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
						setup={(self) => {
							self.connect('notify::active', () => {
								ScreenRecordService.setRecordSelected(self.active)
							});

							self.hook(recordOnlySelectedScreenToggle, () => {
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
