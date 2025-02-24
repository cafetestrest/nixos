import PowermenuService, { PowerMenuAction } from "../../service/PowermenuService";
import { Widget } from "astal/gtk4";
import icons from "../../lib/icons";

type PowermenuButtonProps = {
	action: PowerMenuAction;
	iconName: string;
	onClicked?(): void;
} & Widget.ButtonProps;

const PowermenuButton = ({ action, iconName, onClicked }: PowermenuButtonProps) => (
	<button
        cssClasses={[`powermenu-button`]}
		onClicked={() => {
            PowermenuService.action(action);
            if (onClicked) onClicked();
        }}
	>
		<image iconName={iconName} cssClasses={["powermenu-icon"]} />
	</button>
);

export default ({ onClicked }) => {
    return (
        <box
            cssClasses={["powermenu"]}
            homogeneous
            hexpand={true}
        >
            <PowermenuButton
                action="lock"
                iconName={icons.powermenu.lock}
                onClicked={onClicked}
            />
            <PowermenuButton
                action="sleep"
                iconName={icons.powermenu.sleep}
                onClicked={onClicked}
            />
            <PowermenuButton
                action="logout"
                iconName={icons.powermenu.logout}
                onClicked={onClicked}
            />
            <PowermenuButton
                action="reboot"
                iconName={icons.powermenu.reboot}
                onClicked={onClicked}
            />
            <PowermenuButton
                action="shutdown"
                iconName={icons.powermenu.shutdown}
                onClicked={onClicked}
            />
        </box>
    )
};
