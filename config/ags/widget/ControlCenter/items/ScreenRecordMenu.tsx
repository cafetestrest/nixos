import { Gtk } from "astal/gtk3";
// import { Binding, Variable } from "astal";
import { bind, Binding, Variable } from "astal";
import icons from "../../../lib/icons";
import { spacing } from "../../../lib/variables";
import Button from "../../../common/Button";
import ScreenRecordService from "../../../service/ScreenRecord";
import { Menu } from "../pages/Main";

// const recordMicrophone = Variable(false);
// const recordInternalAudio = Variable(false);


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
				<switch hexpand halign={Gtk.Align.END} />
				{/* // TODO check audio switch or impement it */}
			</box>
			<box
				hexpand
				className={"control-center__dropdown-menu_item"}
				spacing={spacing * 2}
			>
				<icon icon={icons.audio.type.speaker} />
				<label label={"Record internal audio"} />
				<switch hexpand halign={Gtk.Align.END} />
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
