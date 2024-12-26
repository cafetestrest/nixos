import { bind } from "astal"
import AstalHyprland from "gi://AstalHyprland"
import AstalApps from "gi://AstalApps"
import icons, { substitutions } from "../../../lib/icons";
import { Astal, Gdk } from "astal/gtk3";
import { lookUpIcon } from "../../../lib/utils";
import BarButton from "../BarButton";

type Address = {
	address: string;
};

const Hyprland = AstalHyprland.get_default();
const Applications = AstalApps.Apps.new();

function getHyprlandClientIcon(client: AstalHyprland.Client, iconName: string) {
	if (!client) return icons.fallback.executable;

	let icon = "";
	if (iconName)
		icon = iconName;
  
	if ((!icon || icon === "") && client.initialClass !== "")
	  icon = Applications.exact_query(client.initialClass)[0]?.iconName;
	if ((!icon || icon === "") && client.initialTitle !== "")
	  icon = Applications.exact_query(client.initialTitle)[0]?.iconName;

	icon = substitutions.icons[client.initialClass] || icon;

    if (icon === 'preferences-desktop-display') {
        if (iconName === 'Ghostty' || client.initialClass === 'com.mitchellh.ghostty') {
            icon = client.initialClass;
        }
    }

	return Astal.Icon.lookup_icon(icon) ? icon : icons.fallback.executable;
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
            <box className="taskbar">
                {clientList.map((client) => {

				const cls = client.class;
				const icon = substitutions.icons[cls]
					? substitutions.icons[cls]
					: lookUpIcon(cls)
						? cls
						: icons.fallback.executable;
	
                    return (
                        <BarButton
                            onClicked={() => {
                                const address = client.get_address();
                                focus(address);
                            }}
                            onClickRelease={(self, event) => {
                                const address = client.get_address();
                                if (!address) {
                                    return;
                                }
                                switch (event.button) {
                                    case Gdk.BUTTON_SECONDARY:
                                        return close(address);
                                    case Gdk.BUTTON_MIDDLE:
                                        return close(address);
                            }}}
                        >
                            <icon
                                setup={(self) => {
                                    self.set_icon(getHyprlandClientIcon(client, icon));
                                }}
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
