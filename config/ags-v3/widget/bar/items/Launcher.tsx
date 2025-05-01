import GLib from "gi://GLib";
import app from "ags/gtk4/app";

export default () => {
    const icon = GLib.get_os_info("LOGO") || "system-search-symbolic";

    return (
        <button
            $clicked={() => app.toggle_window("launcher")}
        >
              <image iconName={icon} />
        </button>
    );
}
