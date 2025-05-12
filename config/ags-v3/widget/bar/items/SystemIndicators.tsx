import { bind } from "ags/state";
import Gtk from "gi://Gtk?version=4.0";
import AstalNotifd from "gi://AstalNotifd";
import AstalPowerProfiles from "gi://AstalPowerProfiles";
import icons from "../../../lib/icons";
import AstalWp from "gi://AstalWp";
import {
  config,
  SysIndicatorWidgets,
  qsPopupActive
} from "../../../lib/config";
import AstalBluetooth from "gi://AstalBluetooth?version=0.1";
import AstalNetwork from "gi://AstalNetwork";
import { With } from "ags/gtk4";
import IdleService from "../../../service/IdleService";
import NightLightService from "../../../service/NightLightService";
import app from "ags/gtk4/app";

const DNDIndicator = () => {
	const notifd = AstalNotifd.get_default();
	return (
    <image
      cssClasses={["system-indicator"]}
			visible={bind(notifd, "dontDisturb").as((dnd) => dnd)}
			iconName={bind(notifd, "dontDisturb").as(
				(dnd) => icons.notifications[dnd ? "silent" : "noisy"],
			)}
		/>
	);
};

const IdleIndicator = () => {
	if (IdleService) {
		const profile = bind(IdleService, "profile");
		return (
			<image
				cssClasses={["system-indicator"]}
				iconName={profile.as((p) => icons.idle[p])}
			/>
		);
	} else {
		return <image visible={false}/>
	}
};

const NightlightIndicator = () => {
	if (NightLightService) {
		const profile = bind(NightLightService, "profile");
		return (
			<image
				cssClasses={["system-indicator"]}
				iconName={profile.as((p) => icons.nightlight[p])}
			/>
		);
	} else {
		return <image visible={false}/>
	}
};

const MicMuteIndicator = () => {
  const { defaultMicrophone: mic } = AstalWp.get_default()!;
  const mute = bind(mic, "mute");

	return (
		<image
      cssClasses={mute.as(muted => muted ? ["mic-indicator-icon-mute", "system-indicator"] : ["mic-indicator-icon", "system-indicator"])}
			iconName={mute.as((muted) => icons.audio.mic[muted ? "muted" : "high"])}
		/>
	);
};

const BluetoothIndicator = () => {
	const bluetooth = AstalBluetooth.get_default();
  const isPowered = bind(bluetooth, "isPowered");

	return (
    <image
      cssClasses={["bt-indicator-icon", "system-indicator"]}
			visible={isPowered}
			iconName={isPowered.as(p => p ? icons.bluetooth.enabled : icons.bluetooth.disabled)}
		/>
	);
};

const PowerProfileIndicator = () => {
  const power = AstalPowerProfiles.get_default()

	return (
    <image
      cssClasses={["bt-indicator-icon", "system-indicator"]}
			visible={bind(power, "activeProfile").as(p => p !== "balanced")}
			iconName={bind(power, "iconName")}
		/>
	);
};

const WifiIndicator = () => {
  const network = AstalNetwork.get_default();
  const wifi = bind(network, "wifi");

  return (
    <box visible={wifi.as(Boolean)}>
      <With value={wifi}>
        {(wifi) =>
          wifi && (
            <image
              iconName={bind(wifi, "iconName")}
              visible={bind(network, "primary").as(p => p === AstalNetwork.Primary.WIFI)}
            />
          )
        }
      </With>
    </box>
  );
};

const WiredIndicator = () => {
  const network = AstalNetwork.get_default();
  const wired = bind(network, "wired");

  return (
    <box visible={wired.as(Boolean)}>
      <With value={wired}>
        {(wired) =>
          wired && (
            <image
              iconName={bind(wired, "iconName")}
              visible={bind(network, "primary").as(p => p === AstalNetwork.Primary.WIRED)}
            />
          )
        }
      </With>
    </box>
  );
};

const AudioIndicator = () => {
  const { defaultSpeaker: speaker } = AstalWp.get_default()!;

  const volumePercentage = bind(speaker, "volume").as(
      (v) => Math.round(v * 100).toString() + "%",
  );

  const icon = bind(speaker, "icon");

  return (
    <box
      cssClasses={["system-indicator"]}
      spacing={4}
    >
      <image
        tooltipText={volumePercentage}
        iconName={bind(speaker, "volumeIcon")}
      />
      <label cssClasses={["volume-percentage"]} label={volumePercentage} />
      <image
        cssClasses={["headset-icon"]}
        visible={icon.as((icon) => {
          if (icon === 'audio-headset-bluetooth' || icon === 'audio-headset-analog-usb' || icon === 'audio-card-analog-usb')
            return true;
          return false;
        })}
        iconName={icon.as((icon) => {
          if (icon === 'audio-headset-bluetooth' || icon === 'audio-headset-analog-usb' || icon === 'audio-card-analog-usb')
            return icons.audio.type.headset;
          return icons.audio.type.card;
        }
      )} />
    </box>
  );
};

const widgetMap: Record<SysIndicatorWidgets, JSX.Element> = {
  dndIndicator: DNDIndicator(),
  idleIndicator: IdleIndicator(),
  nightlightIndicator: NightlightIndicator(),
  powerProfileIndicator: PowerProfileIndicator(),
  bluetoothIndicator: BluetoothIndicator(),
  wifiIndicator: WifiIndicator(),
  wiredIndicator: WiredIndicator(),
  micMuteIndicator: MicMuteIndicator(),
  audioIndicator: AudioIndicator(),
};

const renderWidgets = (widgetKeys: SysIndicatorWidgets[]) => widgetKeys.map(key => widgetMap[key] || null);

export default () => {
  const { defaultSpeaker: speaker } = AstalWp.get_default()!;

  const scrollController = new Gtk.EventControllerScroll({
    flags: Gtk.EventControllerScrollFlags.VERTICAL,
  });

  return (
    <button
      cssClasses={bind(qsPopupActive).as(a => a ? ["system-indicators", "bar-button", "active"] : ["system-indicators", "bar-button", "inactive"])}
      $clicked={() => {
        app.toggle_window("quicksettings");
        qsPopupActive.set(true);
      }}
      $={self => {
        scrollController.connect('scroll', (_, dx, dy) => {
          if (!speaker) return;

          let { volume } = speaker;

          if (dy > 0) {
            volume = Math.max(0, volume - 0.02);
          } else if (dy < 0) {
            volume = Math.min(1, volume + 0.02);
          }

          speaker.volume = volume;
          speaker.mute = volume <= 0.01;

          if (volume === 0) {
            speaker.volume = 0;
          }
        });

        self.add_controller(scrollController);
      }}
    >
      <box
        halign={Gtk.Align.CENTER}
        spacing={3} // todo
      >
        {renderWidgets(config.systemIndicators.layout)}
      </box>
    </button>
  );
}
