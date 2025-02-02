import { Gtk } from "astal/gtk4";
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
			cssClasses={["control-center__dropdown-menu", "lightstrip-color", "qs-menu"]}
			spacing={spacing * 2}
		>
			<box>
				<label
					hexpand
					label={"Lightstrip Color Menu"}
					cssClasses={["control-center__dropdown-menu_title"]}
					halign={Gtk.Align.CENTER}
				/>
				<button
					hexpand
					cssClasses={["fetch-new-ip"]}
					onClicked={() => {
						closeMenu
						bash('getyeelightip')
					}}
					halign={Gtk.Align.END}
				>
					<image iconName={icons.ui.refresh} />
				</button>
			</box>

			<button
				cssClasses={["cotrol-center-menu-button"]}
				onClicked={() => {
					closeMenu
					bash('~/.config/scripts/yeelight/yeelight-scene.sh 0 On')
				}}
			>
				<box
					hexpand
					cssClasses={["control-center__dropdown-menu_item"]}
					spacing={spacing * 2}
					halign={Gtk.Align.CENTER}
				>
					<image iconName={icons.nightlight[1]} />
					<label label={"Turn Light On"} />
				</box>
			</button>

			<button
				cssClasses={["cotrol-center-menu-button"]}
				onClicked={() => {
					closeMenu
					bash('~/.config/scripts/yeelight/yeelight-scene.sh 0 Off')
				}}
			>
				<box
					hexpand
					cssClasses={["control-center__dropdown-menu_item"]}
					spacing={spacing * 2}
					halign={Gtk.Align.CENTER} 
				>
					<image iconName={icons.powermenu.sleep}/>
					<label label={"Turn Light Off"} />
				</box>
			</button>
		</box>
	);

	return (<Menu name={"lightstrip"} bindVariable={revealMenu} content={[content]}/>);
};
