import AstalNetwork from "gi://AstalNetwork?version=0.1";
import Page from "../Page";
import { Gdk, Gtk, hook } from "astal/gtk4";
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
				cssClasses={["control-center__page_scrollable-content"]}
			>
				<box
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
						cssClasses={["control-center__page_item-header"]}
						setup={(self) => {
							if (wifi.enabled) {
								self.add_css_class("active")
							} else {
								self.remove_css_class("active")
							}

							hook(self, wifi, "notify::enabled", () => {
								if (wifi.enabled) {
									self.add_css_class("active")
								} else {
									self.remove_css_class("active")
								}
							});
						}}
					>
						<image iconName={bind(wifi, "iconName")} />
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
				</box>
				<box vertical spacing={4}>
					{bind(wifi, "accessPoints").as((points) =>
						points.map((ap) => (
							<button
								cssClasses={["control-center__page_item"]}
								onClicked={() => {
                                    nmClient.activate_connection_async()
                                }}
							>
								<box>
									<image iconName={ap.iconName} iconSize={20} />
									<label label={ap.ssid || ""} />
									<image
										visible={bind(
											wifi,
											"activeAccessPoint",
										).as((aap) => aap === ap)}
										iconName={icons.ui.tick}
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
