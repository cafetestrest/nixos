import { App, Gtk, hook } from "astal/gtk4";
import { namespaceApplauncher } from "../../common/Variables";

export default () => {
    return (
        <button
            cssClasses={["app-launcher-button", "bar-button"]}
            onClicked={() => App.toggle_window(namespaceApplauncher)}
            halign={Gtk.Align.CENTER}
            setup={(self) => {
                const window = App.get_window(namespaceApplauncher);
                if (window) {
                    hook(self, window, "notify::visible", () => {
                        self[window.visible ? "add_css_class" : "remove_css_class"]("active");
                    });
                }
            }}
        >
            <label label={""}/>
        </button>
    );
}
