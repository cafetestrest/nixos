import PopupWindow from "../../common/PopupWindow";
import { App, Gdk } from "astal/gtk3";
import PowermenuService, { PowerMenuAction } from "../../service/Powermenu";
import { ButtonProps } from "astal/gtk3/widget";
import icons from "../../lib/icons";
import { toggleWindow } from "../../lib/utils";

export const namespace = "powermenu";

type PowermenuButtonProps = {
	action: PowerMenuAction;
	iconName: string;
} & ButtonProps;

const PowermenuButton = ({ action, iconName }: PowermenuButtonProps) => (
	<button
		className={`powermenu__button`}
		onClicked={() => PowermenuService.action(action)}
	>
		<icon icon={iconName} className={"powermenu-icon"} />
	</button>
);

export const PowermenuButtons = () => (
	<box spacing={24} homogeneous className={"powermenu"} hexpand>
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
			onKeyPressEvent={(self, event) => {
				if (event.get_keyval()[1] === Gdk.KEY_Escape) {
					toggleWindow(self.name);
				}
			}}
		>
			<PowermenuButtons/>
		</PopupWindow>
	);
};
