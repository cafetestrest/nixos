import { Astal } from "astal/gtk4";
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
			<image
	            cssClasses={["system-indicator"]}
				iconName={profile.as((p) => icons.nightlight[p])}
			/>
		);
	} else {
		return <image visible={false}/>
	}
};

const IdleIndicator = () => {
	if (IdleModeService) {
		const profile = bind(IdleModeService, "profile");
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

const BluetoothIndicator = () => {
	const bluetooth = Bluetooth.get_default();
	return (
		<image
			cssClasses={["bt-indicator-icon", "system-indicator"]}
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
            cssClasses={["system-indicator"]}
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
				(muted) => muted ? ["mic-indicator-icon-mute", "system-indicator"] : ["mic-indicator-icon", "system-indicator"]
			)}
			iconName={bind(mic, "mute").as(
				(muted) => icons.audio.mic[muted ? "muted" : "high"],
			)}
		/>
	);
};

const NetworkIndicator = () => {
	const network = Network.get_default();

	if (network == null) {
		return <image iconName={icons.network.wired.disconnected} cssClasses={["system-indicator"]} />
	}
	if (network.wifi == null) {
		return <image iconName={bind(network.wired, "iconName")} cssClasses={["system-indicator"]} />;
	} else if (network.wired == null) {
		return <image iconName={bind(network.wifi, "iconName")} cssClasses={["system-indicator"]} />;
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
            cssClasses={["system-indicator"]}
			tooltipText={bind(network.wifi, "ssid").as(String)}
			iconName={bind(icon)}
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

export default ({cssClasses, onClicked}) => {
    const defaultSpeaker = Wp.get_default()?.audio.defaultSpeaker;

    return (
        <button
            cssClasses={cssClasses}
            onClicked={onClicked}
            onScroll={(_, dx: number, dy: number) => {
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
        >
            <box
                cssClasses={["system-indicators-box"]}
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
