import PowermenuService, { PowerMenuAction } from "../../service/PowermenuService";
import icons from "../../lib/icons";

type PowermenuButtonProps = JSX.IntrinsicElements["button"] & {
    action: PowerMenuAction;
	iconName: string;
	onClicked?(): void;
}

const PowermenuButton = ({ action, iconName, onClicked }: PowermenuButtonProps) => (
	<button
		class={`powermenu-button`}
		onClicked={() => {
            PowermenuService.action(action);
            if (onClicked) onClicked();
        }}
	>
		<icon icon={iconName} class={"powermenu-icon"} />
	</button>
);

export default ({ onClicked }) => {
    return (
        <box
            class={"powermenu"}
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
