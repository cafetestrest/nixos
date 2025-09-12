import PowermenuService from "../../service/PowermenuService";
import icons from "../../lib/icons";
import {
    config,
    setVisiblePowermenu
} from "../../lib/config";
import { PowermenuButtonProps, PowermenuWidgets } from "../../lib/types";

export default () => {
    const PowermenuButton = ({ action, iconName }: PowermenuButtonProps) => (
        <button
            class={`powermenu-button`}
            onClicked={() => {
                PowermenuService.action(action);
                setVisiblePowermenu(false);
            }}
        >
            <icon icon={iconName} class={"powermenu-icon"} />
        </button>
    );

    const powermenuButtons: Record<PowermenuWidgets, JSX.Element> = {
        lock: PowermenuButton({action: "lock", iconName: icons.powermenu.lock}),
        sleep: PowermenuButton({action: "sleep", iconName: icons.powermenu.sleep}),
        logout: PowermenuButton({action: "logout", iconName: icons.powermenu.logout}),
        reboot: PowermenuButton({action: "reboot", iconName: icons.powermenu.reboot}),
        shutdown: PowermenuButton({action: "shutdown", iconName: icons.powermenu.shutdown}),
    };

    const renderWidgets = (widgetKeys: PowermenuWidgets[]) =>
        widgetKeys.map(key => {
            const widget = powermenuButtons[key];
            return widget ? widget : null;
    });

    return (
        <box
            class={"powermenu"}
            homogeneous
            hexpand={true}
        >
            {renderWidgets(config.powermenu.layout)}
        </box>
    )
};
