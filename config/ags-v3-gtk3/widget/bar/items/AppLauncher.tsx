import { Gtk } from "ags/gtk3";
import App from "ags/gtk3/app";
import { enableBarApplauncher, namespaceApplauncher, applauncherIcon } from "../../common/Variables";

export default () => {
    if (enableBarApplauncher === false) {
        return (
            <box visible={false} />
        );
    }

    return (
        <button
            class={"app-launcher-button bar-button"}
            onClicked={() => App.toggle_window(namespaceApplauncher)}
            halign={Gtk.Align.CENTER}
            $={(self) => {
                const window = App.get_window(namespaceApplauncher);
                if (window) {
                    window.connect("notify::visible", () => {
                        self.toggleClassName("active", window.visible);
                    });
                }
            }}
        >
            <label label={applauncherIcon}/>
        </button>
    );
}
