import { Gdk } from "ags/gtk3";
import { createBinding, For } from "ags";
import icons, { substitutions } from "../../../lib/icons";
import AstalHyprland from "gi://AstalHyprland";
import AstalApps from "gi://AstalApps";
import { enableBarTaskbar } from "../../common/Variables";
import { getClassIcon, isIcon } from "../../../lib/utils";

const hyprland = AstalHyprland.get_default();
const Applications = new AstalApps.Apps();

export function getHyprlandClientIcon(client: AstalHyprland.Client, iconName: string) {
	if (!client) return icons.fallback.executable;

    let icon = getClassIcon(client.initialClass, "");

    if (icon !== "") {
        return icon;
    }

	if (iconName)
        icon = getClassIcon(iconName, "");

    if (icon !== "") {
        return icon;
    }

	if ((!icon || icon === "") && client.initialClass !== "")
	  icon = Applications.exact_query(client.initialClass)[0]?.iconName;
	if ((!icon || icon === "") && client.initialTitle !== "")
	  icon = Applications.exact_query(client.initialTitle)[0]?.iconName;

    return getClassIcon(icon);
};

export default () => {
    if (enableBarTaskbar === false) {
        return (
            <box visible={false} />
        );
    }

    const focus = (address: string) => hyprland.dispatch("focuswindow", `address:0x${address}`);
	const close = (address: string) => hyprland.dispatch("closewindow", `address:0x${address}`);

    const clients = createBinding(hyprland, "clients");

    return (
        <box>
            <For each={clients}>
                {(client) => {
                    const cls = client.class;
                    const icon = substitutions.icons[cls]
                        ? substitutions.icons[cls]
                        : isIcon(cls)
                            ? cls
                            : icons.fallback.executable;

                    return (
                        <box>
                            <button
                                class={"bar-button taskbar"}
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
                                tooltipText={client.get_title()}
                            >
                                <icon
                                    icon={getHyprlandClientIcon(client, icon)}
                                />
                            </button>
                        </box>
                    );
                }}
            </For>
        </box>
    );
}
