import { App, Gtk } from "astal/gtk3";
import { enableBarApplauncher, namespaceApplauncher, applauncherIcon } from "../../common/Variables";

export default () => {
    if (enableBarApplauncher === false) {
        return (
            <box visible={false} />
        );
    }

    return (
        <button
            className={"app-launcher-button bar-button"}
            onClicked={() => App.toggle_window(namespaceApplauncher)}
            halign={Gtk.Align.CENTER}
            setup={(self) => {
                const window = App.get_window(namespaceApplauncher);
                if (window) {
                    self.hook(window, "notify::visible", () => {
                        self.toggleClassName("active", window.visible);
                    });
                }
            }}
        >
            <label label={applauncherIcon}/>
        </button>
    );
}
