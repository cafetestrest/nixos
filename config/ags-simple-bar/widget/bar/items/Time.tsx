import { Variable, GLib, bind } from "astal"
import { App } from "astal/gtk3"

export default ({ format = "%a %b %e   %H:%M:%S" }) => {
    const time = Variable<string>("").poll(1000, () =>
        GLib.DateTime.new_now_local().format(format)!)

    return <button
        onClicked={() => App.toggle_window("dashboard")}
        className={"Time"}
        onDestroy={() => time.drop()}
        label={time()}
    />
}
