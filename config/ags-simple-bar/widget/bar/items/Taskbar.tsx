import { App, Gtk, Gdk, Widget, Astal } from "astal/gtk3";
import { bind, timeout, Variable } from "astal";
import icons, { substitutions } from "../../../lib/icons";
import AstalHyprland from "gi://AstalHyprland";
import AstalApps from "gi://AstalApps"

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

	return Astal.Icon.lookup_icon(icon) ? icon : icons.fallback.executable;
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
                        : Astal.Icon.lookup_icon(cls)
                            ? cls
                            : icons.fallback.executable;

                    return (
                        <box>
                            <button
                                className={"bar-button taskbar"}
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
                            </button>
                        </box>
                    );
                })
                .filter((item) => item !== undefined),
            )}
        </box>
    );
}
