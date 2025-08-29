import { Astal } from "ags/gtk3";
import Wp from "gi://AstalWp";
import Network from "gi://AstalNetwork";
import Bluetooth from "gi://AstalBluetooth";
import icons from "../../../lib/icons";
import AstalNotifd from "gi://AstalNotifd";
import NightlightModeService from "../../../service/NightLightService";
import IdleModeService from "../../../service/IdleService";
import { createBinding, createComputed, Accessor } from "ags";

const NightlightIndicator = () => {
	if (NightlightModeService) {
		const profile = createBinding(NightlightModeService, "profile");
		return (
			<icon
	            class={"system-indicator"}
				icon={profile.as((p) => icons.nightlight[p])}
			/>
		);
	} else {
		return <icon visible={false}/>
	}
};

const IdleIndicator = () => {
	if (IdleModeService) {
		const profile = createBinding(IdleModeService, "profile");
		return (
			<icon
				class={"system-indicator"}
				icon={profile.as((p) => icons.idle[p])}
			/>
		);
	} else {
		return <icon visible={false}/>
	}
};

const BluetoothIndicator = () => {
	const bluetooth = Bluetooth.get_default();
	return (
		<icon
			class={"bt-indicator-icon system-indicator"}
			visible={createBinding(bluetooth, "isPowered").as((isPowered) => isPowered)}
			icon={createBinding(bluetooth, "isPowered").as((isPowered) =>
				isPowered ? icons.bluetooth.enabled : icons.bluetooth.disabled,
			)}
		/>
	);
};

const DNDIndicator = () => {
	const notifd = AstalNotifd.get_default();
	return (
		<icon
            class={"system-indicator"}
			visible={createBinding(notifd, "dontDisturb").as((dnd) => dnd)}
			icon={createBinding(notifd, "dontDisturb").as(
				(dnd) => icons.notifications[dnd ? "silent" : "noisy"],
			)}
		/>
	);
};

const MicMuteIndicator = () => {
	const mic = Wp.get_default()?.audio.defaultMicrophone!;
	return (
		<icon
			class={createBinding(mic, "mute").as(
				(muted) => muted ? "mic-indicator-icon-mute system-indicator" : "mic-indicator-icon system-indicator",
			)}
			icon={createBinding(mic, "mute").as(
				(muted) => icons.audio.mic[muted ? "muted" : "high"],
			)}
		/>
	);
};

const NetworkIndicator = () => {
	const network = Network.get_default();

	if (network == null) {
		return <icon icon={icons.network.wired.disconnected} class={"system-indicator"} />
	}
	if (network.wifi == null) {
		return <icon icon={createBinding(network.wired, "iconName")} class={"system-indicator"} />;
	} else if (network.wired == null) {
		return <icon icon={createBinding(network.wifi, "iconName")} class={"system-indicator"} />;
	}

	const primary = createBinding(network, "primary");
	const wifiIcon = createBinding(network.wifi, "iconName");
	const wiredIcon = createBinding(network.wired, "iconName");

	const icon = createComputed(
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
            class={"system-indicator"}
			tooltipText={createBinding(network.wifi, "ssid").as(String)}
			icon={icon}
		/>
	);
};

const AudioIndicator = ({ speaker }: {speaker: Wp.Endpoint}) => {
    const volumePercentage = createBinding(speaker, "volume").as(
        (v) => Math.round(v * 100).toString() + "%",
    );
	const icon = createBinding(speaker, "icon");

	return (
		<box
            class={"system-indicator"}
			spacing={4}
        >
			<icon
				tooltipText={volumePercentage}
				icon={createBinding(speaker, "volumeIcon")}
			/>
			<label class={"volume-percentage"} label={volumePercentage} />
			<icon
				class={"headset-icon"}
				visible={icon.as((icon) => {
					if (icon === 'audio-headset-bluetooth' || icon === 'audio-headset-analog-usb' || icon === 'audio-card-analog-usb')
						return true;
					return false;
				})}
				icon={icon.as((icon) => {
					if (icon === 'audio-headset-bluetooth' || icon === 'audio-headset-analog-usb' || icon === 'audio-card-analog-usb')
						return icons.audio.type.headset;
					return icons.audio.type.card;
				}
			)} />
		</box>
	);
};

type SystemIndicatorsType = {
	className: string | Accessor<string>;
	onClicked: () => void;
}

export default ({className, onClicked}: SystemIndicatorsType) => {
    const defaultSpeaker = Wp.get_default()?.audio.defaultSpeaker;

    return (
        <button
            class={className}
            onClicked={onClicked}
            onScroll={(_, event: Astal.ScrollEvent) => {
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
        >
            <box
                class={"system-indicators-box"}
				spacing={5}
            >
                <DNDIndicator />
                <IdleIndicator />
                <NightlightIndicator />
                <BluetoothIndicator />
                <NetworkIndicator />
                <MicMuteIndicator />
                <AudioIndicator speaker={defaultSpeaker}/>
            </box>
        </button>
    );
};
