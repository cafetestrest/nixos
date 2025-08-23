import icons from "../../lib/icons";
import { execAsync } from "ags/process";
import { config, PowermenuWidgets } from "../../lib/config";
import { Gtk } from "ags/gtk4";

// type PowermenuButtonProps = {
//     action: string;
//     iconName: string;
// } & CCProps<Gtk.Button, Gtk.Button.ConstructorProps>;

const PowermenuButton = ({ action, iconName }) => (
	<button
        cssClasses={["powermenu-button"]}
        onClicked={() => {
            execAsync(action);
        }}
	>
        <image
            cssClasses={["powermenu-icon"]}
            iconName={iconName}
        />
	</button>
);

const powermenuButtons: Record<PowermenuWidgets, JSX.Element> = {
    lock: PowermenuButton({action: config.powermenu.lockCommand, iconName: icons.powermenu.lock}),
    sleep: PowermenuButton({action: config.powermenu.sleepCommand, iconName: icons.powermenu.sleep}),
    logout: PowermenuButton({action: config.powermenu.logoutCommand, iconName: icons.powermenu.logout}),
    reboot: PowermenuButton({action: config.powermenu.rebootCommand, iconName: icons.powermenu.reboot}),
    shutdown: PowermenuButton({action: config.powermenu.shutdownCommand, iconName: icons.powermenu.shutdown}),
};

const renderWidgets = (widgetKeys: PowermenuWidgets[]) =>
    widgetKeys.map(key => {
        const widget = powermenuButtons[key];
        return widget ? widget : null;
});

export default ({ orientation = Gtk.Orientation.HORIZONTAL }) => {
    return (
        <box orientation={orientation}>
            {renderWidgets(config.powermenu.layout)}
        </box>
    );
}
