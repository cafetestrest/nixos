import { Gtk } from "astal/gtk3";
// import { Binding, Variable } from "astal";
import { bind, Binding, Variable } from "astal";
import icons from "../../../lib/icons";
import { spacing } from "../../../lib/variables";
import Button from "../../../common/Button";
import ScreenRecordService, { recordInternalAudioToggle, recordOnlySelectedScreenToggle } from "../../../service/ScreenRecord";
import { Menu } from "../pages/Main";

export default ({
	revealMenu,
	closeMenu,
}: {
	revealMenu: Variable<boolean>;
	closeMenu: () => void;
}) => {
	const content = (
		<box
			vertical
			className={"control-center__dropdown-menu qs-menu"}
			spacing={spacing * 2}
			// visible={bind(revealMenu)}
		>
			<icon
				icon={icons.record}
				className={"control-center__dropdown-menu_icon"}
			/>
			<label
				label={"Start recording?"}
				className={"control-center__dropdown-menu_title"}
			/>
			<box
				hexpand
				className={"control-center__dropdown-menu_item"}
				spacing={spacing * 2}
			>
				<icon icon={icons.audio.mic.high} />
				<label label={"Record audio"} />
				<switch
					hexpand
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
			<box
				hexpand
				className={"control-center__dropdown-menu_item"}
				spacing={spacing * 2}
			>
				<icon icon={icons.select} />
				<label label={"Record only selected size"} />
				<switch
					hexpand
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
				{/* <icon icon={icons.audio.type.speaker} />
				<label label={"Record internal audio"} />
				<switch hexpand halign={Gtk.Align.END} /> */}
			</box>
			<box hexpand halign={Gtk.Align.END} spacing={spacing}>
				<Button buttonType="outlined" onClicked={closeMenu}>
					Cancel
				</Button>
				<Button
					onClicked={() => {
						ScreenRecordService.start();
						closeMenu();
					}}
				>
					Start
				</Button>
			</box>
		</box>
	);

	return (<Menu name={"screenrecord"} bindVariable={revealMenu} content={[content]}/>);
};
