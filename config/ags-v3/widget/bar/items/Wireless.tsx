import { bind } from "ags/state";
import Gtk from "gi://Gtk?version=4.0";
import AstalNetwork from "gi://AstalNetwork";
import { execAsync } from "ags/process";
import { For, With } from "ags/gtk4";

export default () => {
  const network = AstalNetwork.get_default();
  const wifi = bind(network, "wifi");

  const sorted = (arr: Array<AstalNetwork.AccessPoint>) => {
    return arr.filter((ap) => !!ap.ssid).sort((a, b) => b.strength - a.strength)
  };

  async function connect(ap: AstalNetwork.AccessPoint) {
    // connecting to ap is not yet supported
    // https://github.com/Aylur/astal/pull/13
    try {
      await execAsync(`nmcli d wifi connect ${ap.bssid}`);
    } catch (error) {
      // you can implement a popup asking for password here
      console.error(error);
    }
  };

  return (
    <box visible={wifi.as(Boolean)}>
      <With value={bind(network, "wifi")}>
        {(wifi) =>
          wifi && (
            <menubutton>
              <image iconName={bind(wifi, "iconName")} />
              <popover>
                <box orientation={Gtk.Orientation.VERTICAL}>
                  <For each={bind(wifi, "accessPoints").as(sorted)}>
                    {(ap) => (
                      <button $clicked={() => connect(ap)}>
                        <box spacing={4}>
                          <image iconName={bind(ap, "iconName")} />
                          <label label={bind(ap, "ssid")} />
                          <image
                            iconName="object-select-symbolic"
                            visible={bind(wifi, "activeAccessPoint").as(
                              (active) => active === ap,
                            )}
                          />
                        </box>
                      </button>
                    )}
                  </For>
                </box>
              </popover>
            </menubutton>
          )
        }
      </With>
    </box>
  );
}
