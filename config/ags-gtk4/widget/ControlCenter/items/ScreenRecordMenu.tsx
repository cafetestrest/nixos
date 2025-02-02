import { Gtk, hook } from "astal/gtk4";
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
			cssClasses={["control-center__dropdown-menu", "qs-menu"]}
			spacing={spacing * 2}
		>
			<image
				iconName={icons.record}
				cssClasses={["control-center__dropdown-menu_icon"]}
			/>
			<label
				label={"Start recording?"}
				cssClasses={["control-center__dropdown-menu_title"]}
			/>
			<box
				hexpand
				cssClasses={["control-center__dropdown-menu_item"]}
				spacing={spacing * 2}
			>
				<image iconName={icons.audio.mic.high} />
				<label label={"Record audio"} />
				<switch
					hexpand
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
			<box
				hexpand
				cssClasses={["control-center__dropdown-menu_item"]}
				spacing={spacing * 2}
			>
				<image iconName={icons.select} />
				<label label={"Record only selected size"} />
				<switch
					hexpand
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
				{/* <image iconName={icons.audio.type.speaker} />
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
