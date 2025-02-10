import { Gdk, Gtk } from "astal/gtk3";
import { bind, timeout } from "astal";
import Bluetooth from "gi://AstalBluetooth"
import icons from "../../../lib/icons";
import { qsPage } from "../../common/Variables";

function BluetoothPage() {
    const bluetooth = Bluetooth.get_default();

	return (
        <eventbox
            onClickRelease={(_, event) => {
                if (event.button !== Gdk.BUTTON_PRIMARY) return;
                // bluetooth.toggle();
            }}
        >
            <box>
                <icon
                    icon={bind(bluetooth, "isPowered").as((status) =>
                        status
                            ? icons.bluetooth.enabled
                            : icons.bluetooth.disabled,
                    )}
                />
                <label
                    label={bind(bluetooth, "isPowered").as((status) =>
                        status ? "On" : "Off",
                    )}
                    hexpand
                    halign={Gtk.Align.START}
                />
                <switch
                    hexpand={false}
                    halign={Gtk.Align.END}
                    valign={Gtk.Align.CENTER}
                    active={bind(bluetooth, "isPowered")}
                    onActivate={({ active }) =>
                        (bluetooth.isPowered = active)
                    }
                />
            </box>
        </eventbox>
    );
}

export default () => {
    const name = "bluetooth";
    const refresh = false;

	return (
        <box
			name={name}
			className="qs-bluetooth-page"
            vertical={true}
        >
			<centerbox className="qs-page-header" spacing={12}>
            <button
					hexpand={false}
					halign={Gtk.Align.START}
					className="qs-page-header-button"
					onClicked={() => qsPage.set("main")}
				>
					<icon icon={icons.ui.arrow.left} className={"page-icon"} />
				</button>
                <label
					className="qs-page-header-title"
					halign={Gtk.Align.CENTER}
					hexpand={true}
					label={name}
				/>
                {refresh ? (
					<button
						halign={Gtk.Align.END}
						hexpand={false}
						className="qs-page-header-button"
						// onClicked={refresh}
					>
						<icon hexpand={false} icon={icons.ui.refresh} className={"page-icon"} />
					</button>
				) : (
					<box visible={false}/>
				)}
            </centerbox>
            <scrollable vexpand={true} className="control-center__page_content">
                <BluetoothPage/>
			</scrollable>
        </box>
    );
}
