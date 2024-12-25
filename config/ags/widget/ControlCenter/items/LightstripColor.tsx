import { Gtk } from "astal/gtk3";
import { bind, Binding, Variable } from "astal";
import icons from "../../../lib/icons";
import { spacing } from "../../../lib/variables";
import { bash } from "../../../lib/utils";
import { Menu } from "../pages/Main";

export const revealLightstripColor = Variable(false);

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
			className={"control-center__dropdown-menu lightstrip-color qs-menu"}
			spacing={spacing * 2}
			// visible={bind(revealMenu)}
		>
			<box>
				<label
					hexpand
					label={"Lightstrip Color Menu"}
					className={"control-center__dropdown-menu_title"}
					halign={Gtk.Align.CENTER}
				/>
				<button
					hexpand
					className={"fetch-new-ip"}
					onClicked={() => {
						closeMenu
						bash('getyeelightip')
					}}
					halign={Gtk.Align.END}
				>
					<icon icon={icons.ui.refresh} />
				</button>
			</box>

			<button
				className={"cotrol-center-menu-button"}
				onClicked={() => {
					closeMenu
					bash('~/.config/scripts/yeelight/yeelight-scene.sh 0 On')
				}}
			>
				<box
					hexpand
					className={"control-center__dropdown-menu_item"}
					spacing={spacing * 2}
					halign={Gtk.Align.CENTER}
				>
					<icon icon={icons.nightlight[1]} />
					<label label={"Turn Light On"} />
				</box>
			</button>

			<button
				className={"cotrol-center-menu-button"}
				onClicked={() => {
					closeMenu
					bash('~/.config/scripts/yeelight/yeelight-scene.sh 0 Off')
				}}
			>
				<box
					hexpand
					className={"control-center__dropdown-menu_item"}
					spacing={spacing * 2}
					halign={Gtk.Align.CENTER} 
				>
					<icon icon={icons.powermenu.sleep}/>
					<label label={"Turn Light Off"} />
				</box>
			</button>
		</box>
	);

	return (<Menu name={"lightstrip"} bindVariable={revealMenu} content={[content]}/>);
};
