import Wp from "gi://AstalWp";
import Network from "gi://AstalNetwork";
import Bluetooth from "gi://AstalBluetooth";
import BarButton from "../BarButton";
import { App } from "astal/gtk3";
import { bind, Variable } from "astal";
import icons from "../../../lib/icons";
import AstalNotifd from "gi://AstalNotifd?version=0.1";
import { toggleWindow } from "../../../lib/utils";
import NightlightModeService from "../../../service/NightLight";
import IdleModeService from "../../../service/Idle";

const NightlightIndicator = () => {
	if (NightlightModeService) {
		const profile = bind(NightlightModeService, "profile");
		return (
			<icon
				icon={profile.as((p) => icons.nightlight[p])}
			/>
		);	
	} else {
		return <icon />
	}
};

const IdleIndicator = () => {
	if (IdleModeService) {
		const profile = bind(IdleModeService, "profile");
		return (
			<icon
				icon={profile.as((p) => icons.idle[p])}
			/>
		);	
	} else {
		return <icon />
	}
};

const BluetoothIndicator = () => {
	const bluetooth = Bluetooth.get_default();
	return (
		<icon
			className={"bt-indicator-icon"}
			visible={bind(bluetooth, "isPowered").as((isPowered) => isPowered)}
			icon={bind(bluetooth, "isPowered").as((isPowered) =>
				isPowered ? icons.bluetooth.enabled : icons.bluetooth.disabled,
			)}
		/>
	);
};

const DNDIndicator = () => {
	const notifd = AstalNotifd.get_default();
	return (
		<icon
			visible={bind(notifd, "dontDisturb").as((dnd) => dnd)}
			icon={bind(notifd, "dontDisturb").as(
				(dnd) => icons.notifications[dnd ? "silent" : "noisy"],
			)}
		/>
	);
};

const MicMuteIndicator = () => {
	const mic = Wp.get_default()?.audio.defaultMicrophone!;
	return (
		<icon
			className={bind(mic, "mute").as(
				(muted) => muted ? "mic-indicator-icon-muted" : "mic-indicator-icon",
			)}
			// visible={bind(mic, "mute").as((muted) => muted)}
			icon={bind(mic, "mute").as(
				(muted) => icons.audio.mic[muted ? "muted" : "high"],
			)}
		/>
	);
};

const NetworkIndicator = () => {
	const network = Network.get_default();

	if (network == null) {
		return <icon icon={icons.network.wired.disconnected} />
	}
	if (network.wifi == null) {
		return <icon icon={bind(network.wired, "iconName")} />;
	} else if (network.wired == null) {
		return <icon icon={bind(network.wifi, "iconName")} />;
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
		<icon
			tooltipText={bind(network.wifi, "ssid").as(String)}
			icon={bind(icon)}
		/>
	);
};

const AudioIndicator = () => {
	const speaker = Wp.get_default()?.audio.defaultSpeaker!;

	return (
		<box>
			<icon
				tooltipText={bind(speaker, "volume").as(
					(v) => Math.round(v * 100).toString() + "%",
				)}
				icon={bind(speaker, "volumeIcon")}
			/>
			<label className={"volume-percentage"} label={bind(speaker, "volume").as(
					(v) => Math.round(v * 100).toString() + "%",
				)} />
			<icon
				className={"headset-icon"}
				visible={bind(speaker, 'icon').as((icon) => {
					if (icon === 'audio-headset-bluetooth' || icon === 'audio-headset-analog-usb' || icon === 'audio-card-analog-usb')
						return true;
					return false;
				})}
				icon={bind(speaker, 'icon').as((icon) => {
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
			onClicked={() => toggleWindow("control-center")}
			onScroll={(self, event) => {
				const defaultSpeaker = Wp.get_default()?.audio.defaultSpeaker;
				if (defaultSpeaker) {
					if (event.delta_y > 0 && defaultSpeaker.volume <= 0.02) {
						defaultSpeaker.volume = 0;
						defaultSpeaker.mute = true;
					} else if (event.delta_y < 0 && defaultSpeaker.volume >= 1) {
						defaultSpeaker.volume = 1;
					} else if (event.delta_y < 0) defaultSpeaker.volume += 0.02;
					else defaultSpeaker.volume -= 0.02;

					if (defaultSpeaker.mute && defaultSpeaker.volume >= 0.01) {
						defaultSpeaker.mute = false;
					}
				}
			}}
			setup={(self) => {
				const controlCenterWindow = App.get_window("control-center");
				if (controlCenterWindow) {
					self.hook(controlCenterWindow, "notify::visible", () => {
						self.toggleClassName(
							"active",
							controlCenterWindow.visible,
						);
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
