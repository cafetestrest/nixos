import { App } from "astal/gtk3"
import { Gtk } from "astal/gtk3"

export default () => {
    return (
        <button
            onClicked={() => App.toggle_window("launcher")}//todo
            halign={Gtk.Align.CENTER}
            label={"o"}//todo
        />
    );
}
