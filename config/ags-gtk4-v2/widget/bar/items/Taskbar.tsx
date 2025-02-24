import { Gdk, Astal } from "astal/gtk4";
import { bind } from "astal";
import icons, { substitutions } from "../../../lib/icons";
import AstalHyprland from "gi://AstalHyprland";
import AstalApps from "gi://AstalApps";
import { lookUpIcon } from "../../../lib/utils";
import { iconScale } from "../../common/Variables";

const hyprland = AstalHyprland.get_default();
const Applications = new AstalApps.Apps();

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

	return lookUpIcon(icon, iconScale) ? icon : icons.fallback.executable;
};

export default () => {
    const focus = (address: string) => hyprland.dispatch("focuswindow", `address:0x${address}`);
	const close = (address: string) => hyprland.dispatch("closewindow", `address:0x${address}`);

    return (
        <box>
            {bind(hyprland, "clients").as((clients) =>
                clients
                .reverse()
                .map((client) => {
                    const cls = client.class;
				    const icon = substitutions.icons[cls]
                        ? substitutions.icons[cls]
                        : lookUpIcon(cls, iconScale)
                            ? cls
                            : icons.fallback.executable;

                    return (
                        <box>
                            <button
                                cssClasses={["bar-button", "taskbar"]}
                                onClicked={() => {
                                    const address = client.get_address();
                                    focus(address);
                                }}
                                onButtonPressed={(_, event: Gdk.ButtonEvent) => {
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
                            </button>
                        </box>
                    );
                })
                .filter((item) => item !== undefined),
            )}
        </box>
    );
}
