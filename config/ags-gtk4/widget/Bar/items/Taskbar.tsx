import { bind } from "astal"
import AstalHyprland from "gi://AstalHyprland"
import AstalApps from "gi://AstalApps"
import icons, { substitutions } from "../../../lib/icons";
import { Gdk } from "astal/gtk4";
import BarButton from "../BarButton";

const Hyprland = AstalHyprland.get_default();
const Applications = AstalApps.Apps.new();

export function getHyprlandClientIcon(client: AstalHyprland.Client, iconName: string) {
	if (!client) return icons.fallback.executable;

	let icon = "";
	if (iconName)
		icon = iconName;
  
	if ((!icon || icon === "") && client.initialClass !== "")
	  icon = Applications.exact_query(client.initialClass)[0]?.iconName;
	if ((!icon || icon === "") && client.initialTitle !== "")
	  icon = Applications.exact_query(client.initialTitle)[0]?.iconName;

	icon = substitutions.icons[client.initialClass] || icon;

    if (icon) {
        return icon;
    }
    return icons.fallback.executable;
	// return Astal.Icon.lookup_icon(icon) ? icon : icons.fallback.executable; //TODOfix does not exist on GTK4
};

export default () => {
    const clients = bind(Hyprland, 'clients');

	const focus = (address: string) => Hyprland.dispatch("focuswindow", `address:0x${address}`);
	const close = (address: string) => Hyprland.dispatch("closewindow", `address:0x${address}`);

    const clientList = clients.as((clientList) => {
        if (clientList.length === 0) {
            return <box />;
        }
        return (
            <box cssClasses={["taskbar"]}>
                {clientList.map((client) => {

				const cls = client.class;
				// const icon = substitutions.icons[cls]
				// 	? substitutions.icons[cls]
				// 	: lookUpIcon(cls)
				// 		? cls
				// 		: icons.fallback.executable; //TODOfix does not work on GTK4
                const icon = substitutions.icons[cls]
                    ? substitutions.icons[cls]
                    : cls;
	
                    return (
                        <BarButton
                            onClicked={() => {
                                const address = client.get_address();
                                focus(address);
                            }}
                            onButtonReleased={(_, event) => {
                                const address = client.get_address();
                                if (!address) {
                                    return;
                                }
                                switch (event.get_button()) {
                                    case Gdk.BUTTON_SECONDARY:
                                        return close(address);
                                    case Gdk.BUTTON_MIDDLE:
                                        return close(address);
                            }}}
                        >
                            <image
                                iconName={getHyprlandClientIcon(client, icon)}
                            />
                        </BarButton>
                    );
                })}
            </box>
        );
    });

    return <box>
        {clientList}
    </box>
};
