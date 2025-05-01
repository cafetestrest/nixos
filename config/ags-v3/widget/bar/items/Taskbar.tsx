import AstalHyprland from "gi://AstalHyprland";
import { bind } from "ags/state";
import { For } from "ags/gtk4";
import { config } from "../../../lib/config";

export default () => {
    const hyprland = AstalHyprland.get_default();
    const substitutions = config.substitutions.icons;

    return (
        <box
            cssClasses={["taskbar"]}
        >
            <For each={bind(hyprland, "clients").as(client => client
                .sort((a, b) => a.workspace.id - b.workspace.id)
            )}>
                {(client) => {
                    const focused = bind(hyprland, "focusedClient").as(fc => fc === client);
                    const icon = substitutions[client.class] || client.class;

                    return (
                        <button
                            cssClasses={focused.as(f => f ? ["focused"] : [])}
                        >
                            <image iconName={icon}/>
                        </button>
                    );
                }}
            </For>
        </box>
    );
}
