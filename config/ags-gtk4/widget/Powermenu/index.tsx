import PopupWindow from "../../common/PopupWindow";
import { App, Gdk} from "astal/gtk4";
import PowermenuService, { PowerMenuAction } from "../../service/Powermenu";
import { ButtonProps } from "astal/gtk4/widget";
import icons from "../../lib/icons";
import { toggleWindow } from "../../lib/utils";

export const namespace = "powermenu";

type PowermenuButtonProps = {
	action: PowerMenuAction;
	iconName: string;
} & ButtonProps;

const PowermenuButton = ({ action, iconName }: PowermenuButtonProps) => (
	<button
		cssClasses={[`powermenu__button`]}
		onClicked={() => PowermenuService.action(action)}
	>
		<image iconName={iconName} cssClasses={["powermenu-icon"]} />
	</button>
);

export const PowermenuButtons = () => (
	<box spacing={24} homogeneous cssClasses={[namespace]} hexpand>
		<PowermenuButton
			action="lock"
			iconName={icons.powermenu.lock}
		/>
		<PowermenuButton
			action="sleep"
			iconName={icons.powermenu.sleep}
		/>
		<PowermenuButton
			action="logout"
			iconName={icons.powermenu.logout}
		/>
		<PowermenuButton
			action="reboot"
			iconName={icons.powermenu.reboot}
		/>
		<PowermenuButton
			action="shutdown"
			iconName={icons.powermenu.shutdown}
		/>
	</box>
);

export default () => {
	return (
		<PopupWindow
			application={App}
			scrimType="opaque"
			name={namespace}
			namespace={namespace}
			onKeyPressed={(_, keyval) => {
				if (keyval === Gdk.KEY_Escape) {
					toggleWindow(namespace);
				}
			}}
		>
			<PowermenuButtons/>
		</PopupWindow>
	);
};
