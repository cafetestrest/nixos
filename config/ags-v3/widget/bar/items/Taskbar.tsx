import AstalHyprland from "gi://AstalHyprland";
import { config } from "../../../lib/config";
import { For, createBinding } from "ags"

export default () => {
    if (!config.hyprland.enabled) {
        return <box visible={false} />
    };

    const hyprland = AstalHyprland.get_default();
    const substitutions = config.substitutions.icons;

    return (
        <box
            cssClasses={["taskbar"]}
        >
            <For each={createBinding(hyprland, "clients").as(client => client
                .sort((a, b) => a.workspace.id - b.workspace.id)
            )}>
                {(client) => {
                    const focused = createBinding(hyprland, "focusedClient").as(fc => fc === client);
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
