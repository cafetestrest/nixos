import { Astal } from "astal/gtk3";
import { bind, Variable } from "astal";
import Wp from "gi://AstalWp";
import Network from "gi://AstalNetwork";
import Bluetooth from "gi://AstalBluetooth";
import icons from "../../../lib/icons";
import AstalNotifd from "gi://AstalNotifd";
import NightlightModeService from "../../../service/NightLightService";
import IdleModeService from "../../../service/IdleService";

const NightlightIndicator = () => {
	if (NightlightModeService) {
		const profile = bind(NightlightModeService, "profile");
		return (
			<icon
	            className={"system-indicator"}
				icon={profile.as((p) => icons.nightlight[p])}
			/>
		);
	} else {
		return <icon visible={false}/>
	}
};

const IdleIndicator = () => {
	if (IdleModeService) {
		const profile = bind(IdleModeService, "profile");
		return (
			<icon
				className={"system-indicator"}
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
			className={"bt-indicator-icon system-indicator"}
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
            className={"system-indicator"}
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
				(muted) => muted ? "mic-indicator-icon-mute system-indicator" : "mic-indicator-icon system-indicator",
			)}
			icon={bind(mic, "mute").as(
				(muted) => icons.audio.mic[muted ? "muted" : "high"],
			)}
		/>
	);
};

const NetworkIndicator = () => {
	const network = Network.get_default();

	if (network == null) {
		return <icon icon={icons.network.wired.disconnected} className={"system-indicator"} />
	}
	if (network.wifi == null) {
		return <icon icon={bind(network.wired, "iconName")} className={"system-indicator"} />;
	} else if (network.wired == null) {
		return <icon icon={bind(network.wifi, "iconName")} className={"system-indicator"} />;
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
            className={"system-indicator"}
			tooltipText={bind(network.wifi, "ssid").as(String)}
			icon={bind(icon)}
		/>
	);
};

const AudioIndicator = ({ speaker }) => {
    const volumePercentage = bind(speaker, "volume").as(
        (v) => Math.round(v * 100).toString() + "%",
    );
	const icon = bind(speaker, "icon");

	return (
		<box
            className={"system-indicator"}
			spacing={4}
        >
			<icon
				tooltipText={volumePercentage}
				icon={bind(speaker, "volumeIcon")}
			/>
			<label className={"volume-percentage"} label={volumePercentage} />
			<icon
				className={"headset-icon"}
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

export default ({className, onClicked}) => {
    const defaultSpeaker = Wp.get_default()?.audio.defaultSpeaker;

    return (
        <button
            className={className}
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
                className={"system-indicators-box"}
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
