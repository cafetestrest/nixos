import AstalNetwork from "gi://AstalNetwork?version=0.1";
import Page from "../Page";
import { Gdk, Gtk } from "astal/gtk3";
import { bind } from "astal";
import icons from "../../../lib/icons";

export default () => {
	const network = AstalNetwork.get_default();
	const nmClient = network.get_client();
	const { wifi } = AstalNetwork.get_default();

	if (wifi == null) {
		return null;
	}

	return (
		<Page
			label={"Network"}
			refresh={() => wifi.scan()}
			scanning={bind(wifi, "scanning")}
		>
			<box
				vertical
				spacing={8}
				className={"control-center__page_scrollable-content"}
			>
				<eventbox
					onClickRelease={(_, event) => {
						if (event.button !== Gdk.BUTTON_PRIMARY) return;
						if (network.wifi.enabled) {
							network.wifi.enabled = false;
						} else {
							network.wifi.enabled = true;
							network.wifi.scan();
						}
					}}
				>
					<box
						className="control-center__page_item-header"
						setup={(self) => {
							self.toggleClassName("active", wifi.enabled);
							self.hook(wifi, "notify::enabled", () => {
								self.toggleClassName("active", wifi.enabled);
							});
						}}
					>
						<icon icon={bind(wifi, "iconName")} />
						<label
							label={"Wi-Fi"}
							hexpand
							halign={Gtk.Align.START}
						/>
						<switch
							hexpand={false}
							halign={Gtk.Align.END}
							valign={Gtk.Align.CENTER}
							active={bind(wifi, "enabled")}
							onActivate={({ active }) =>
								(network.wifi.enabled = active)
							}
						/>
					</box>
				</eventbox>
				<box vertical spacing={4}>
					{bind(wifi, "accessPoints").as((points) =>
						points.map((ap) => (
							<button
								className="control-center__page_item"
								onClicked={() => {
                                    nmClient.activate_connection_async()
                                }}
							>
								<box>
									<icon icon={ap.iconName} iconSize={20} />
									<label label={ap.ssid || ""} />
									<icon
										visible={bind(
											wifi,
											"activeAccessPoint",
										).as((aap) => aap === ap)}
										icon={icons.ui.tick}
										hexpand
										halign={Gtk.Align.END}
									/>
								</box>
							</button>
						)),
					)}
				</box>
			</box>
		</Page>
	);
};
