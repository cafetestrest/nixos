import Hyprland from "gi://AstalHyprland";
import { createBinding } from "ags";

export default () => {
    const hypr = Hyprland.get_default()
    const focused = createBinding(hypr, "focusedClient")

    return <box
        class={"focused-client"}
        visible={focused.as(Boolean)}>
        <label label={createBinding(focused, "title").as(String)} />
    </box>
}
