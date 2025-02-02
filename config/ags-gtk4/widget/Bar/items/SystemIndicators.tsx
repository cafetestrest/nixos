import Wp from "gi://AstalWp";
import Network from "gi://AstalNetwork";
import Bluetooth from "gi://AstalBluetooth";
import BarButton from "../BarButton";
import { App, hook } from "astal/gtk4";
import { bind, Variable } from "astal";
import icons from "../../../lib/icons";
import AstalNotifd from "gi://AstalNotifd?version=0.1";
import { toggleWindow } from "../../../lib/utils";
import NightlightModeService from "../../../service/NightLight";
import IdleModeService from "../../../service/Idle";
import { namespace } from "../../ControlCenter";

const NightlightIndicator = () => {
	if (NightlightModeService) {
		const profile = bind(NightlightModeService, "profile");
		return (
			<image
				iconName={profile.as((p) => icons.nightlight[p])}
			/>
		);	
	} else {
		return <image />
	}
};

const IdleIndicator = () => {
	if (IdleModeService) {
		const profile = bind(IdleModeService, "profile");
		return (
			<image
				iconName={profile.as((p) => icons.idle[p])}
			/>
		);	
	} else {
		return <image />
	}
};

const BluetoothIndicator = () => {
	const bluetooth = Bluetooth.get_default();
	return (
		<image
			cssClasses={["bt-indicator-icon"]}
			visible={bind(bluetooth, "isPowered").as((isPowered) => isPowered)}
			iconName={bind(bluetooth, "isPowered").as((isPowered) =>
				isPowered ? icons.bluetooth.enabled : icons.bluetooth.disabled,
			)}
		/>
	);
};

const DNDIndicator = () => {
	const notifd = AstalNotifd.get_default();
	return (
		<image
			visible={bind(notifd, "dontDisturb").as((dnd) => dnd)}
			iconName={bind(notifd, "dontDisturb").as(
				(dnd) => icons.notifications[dnd ? "silent" : "noisy"],
			)}
		/>
	);
};

const MicMuteIndicator = () => {
	const mic = Wp.get_default()?.audio.defaultMicrophone!;
	return (
		<image
			cssClasses={bind(mic, "mute").as(
				(muted) => muted ? ["mic-indicator-icon-muted"] : ["mic-indicator-icon"],
			)}
			// visible={bind(mic, "mute").as((muted) => muted)}
			iconName={bind(mic, "mute").as(
				(muted) => icons.audio.mic[muted ? "muted" : "high"],
			)}
		/>
	);
};

const NetworkIndicator = () => {
	const network = Network.get_default();

	if (network == null) {
		return <image iconName={icons.network.wired.disconnected} />
	}
	if (network.wifi == null) {
		return <image iconName={bind(network.wired, "iconName")} />;
	} else if (network.wired == null) {
		return <image iconName={bind(network.wifi, "iconName")} />;
	}

	const primary = bind(network, "primary");
	const wifiIcon = bind(network.wifi, "iconName");
	const wiredIcon = bind(network.wired, "iconName");

	const icon = Variable.derive(
		[primary, wifiIcon, wiredIcon],
		(primary, iconWifi, iconWired) => {
			if (primary == Network.Primary.WIFI) {
				return iconWifi;
			} else {
				return iconWired;
			}
		},
	);

	return (
		<image
			tooltipText={bind(network.wifi, "ssid").as(String)}
			iconName={bind(icon)}
		/>
	);
};

const AudioIndicator = () => {
	const speaker = Wp.get_default()?.audio.defaultSpeaker!;

	return (
		<box>
			<image
				tooltipText={bind(speaker, "volume").as(
					(v) => Math.round(v * 100).toString() + "%",
				)}
				iconName={bind(speaker, "volumeIcon")}
			/>
			<label cssClasses={["volume-percentage"]} label={bind(speaker, "volume").as(
					(v) => Math.round(v * 100).toString() + "%",
				)} />
			<image
				cssClasses={["headset-icon"]}
				visible={bind(speaker, 'icon').as((icon) => {
					if (icon === 'audio-headset-bluetooth' || icon === 'audio-headset-analog-usb' || icon === 'audio-card-analog-usb')
						return true;
					return false;
				})}
				iconName={bind(speaker, 'icon').as((icon) => {
					if (icon === 'audio-headset-bluetooth' || icon === 'audio-headset-analog-usb' || icon === 'audio-card-analog-usb')
						return icons.audio.type.headset;
					return icons.audio.type.card;
				}
			)} />
		</box>
	);
};

export default () => {
	return (
		<BarButton
			className="bar__system-indicators"
			onClicked={() => toggleWindow(namespace)}
			onScroll={(_, dx, dy) => {
				const defaultSpeaker = Wp.get_default()?.audio.defaultSpeaker;
				if (defaultSpeaker) {
					if (dy > 0 && defaultSpeaker.volume <= 0.02) {
						defaultSpeaker.volume = 0;
						defaultSpeaker.mute = true;
					} else if (dy < 0 && defaultSpeaker.volume >= 1) {
						defaultSpeaker.volume = 1;
					} else if (dy < 0) defaultSpeaker.volume += 0.02;
					else defaultSpeaker.volume -= 0.02;

					if (defaultSpeaker.mute && defaultSpeaker.volume >= 0.01) {
						defaultSpeaker.mute = false;
					}
				}
			}}
			setup={(self) => {
				const controlCenterWindow = App.get_window(namespace);
				if (controlCenterWindow) {
					hook(self, controlCenterWindow, "notify::visible", () => {
						if (controlCenterWindow.visible) {
							self.add_css_class("active")
						} else {
							self.remove_css_class("active")
						}
					});
				}
			}}
		>
			<box spacing={10}>
				<DNDIndicator />
				<IdleIndicator />
				<NightlightIndicator />
				<BluetoothIndicator />
				<NetworkIndicator />
				<MicMuteIndicator />
				<AudioIndicator />
			</box>
		</BarButton>
	);
};
