import App from 'resource:///com/github/Aylur/ags/app.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Notifications from 'resource:///com/github/Aylur/ags/service/notifications.js';
import Bluetooth from 'resource:///com/github/Aylur/ags/service/bluetooth.js';
import Audio from 'resource:///com/github/Aylur/ags/service/audio.js';
import Network from 'resource:///com/github/Aylur/ags/service/network.js';
import HoverRevealer from '../../misc/HoverRevealer.js';
import PanelButton from '../PanelButton.js';
import Asusctl from '../../services/asusctl.js';
import Indicator from '../../services/onScreenIndicator.js';
import icons from '../../icons.js';
import FontIcon from '../../misc/FontIcon.js';

import { PercentLabel, VolumeIndicator } from '../../quicksettings/widgets/Volume.js';
import { IdleIndicator } from '../../quicksettings/widgets/Idle.js';
import { NightlightIndicator } from '../../quicksettings/widgets/NightLight.js';
import Btdevice from '../../services/btdevice.js';

const ProfileIndicator = () => Widget.Icon()
    .bind('visible', Asusctl, 'profile', p => p !== 'Balanced')
    .bind('icon', Asusctl, 'profile', i => icons.asusctl.profile[i]);

const ModeIndicator = () => FontIcon()
    .bind('visible', Asusctl, 'mode', m => m !== 'Hybrid')
    .bind('icon', Asusctl, 'mode', i => icons.asusctl.mode[i]);

const MicrophoneIndicator = () => Widget.Icon().hook(Audio, icon => {
    if (!Audio.microphone)
        return;

    const { muted, low, medium, high } = icons.audio.mic;

    /** @type {Array<[number, string]>} */
    const cons = [[67, high], [34, medium], [1, low], [0, muted]];
    icon.icon = cons.find(([n]) => n <= Audio.microphone.volume * 100)?.[1] || '';

    icon.visible = Audio.recorders.length > 0 || Audio.microphone.is_muted;
}, 'microphone-changed');

const DNDIndicator = () => Widget.Icon({
    visible: Notifications.bind('dnd'),
    icon: icons.notifications.silent,
});

const BluetoothDevicesIndicator = () => Widget.Box().hook(Bluetooth, box => {
    box.children = Bluetooth.connectedDevices
        .map(({ iconName, name }) => HoverRevealer({
            indicator: Widget.Icon(iconName + '-symbolic'),
            child: Widget.Label(name),
        }));

    box.visible = Bluetooth.connectedDevices.length > 0;
}, 'notify::connected-devices');

const BluetoothIndicator = () => Widget.Icon({
    class_name: 'bluetooth',
    icon: icons.bluetooth.enabled,
    visible: Bluetooth.bind('enabled'),
});

const NetworkIndicator = () => Widget.Icon().hook(Network, self => {
    // const icon = Network[Network.primary || 'wifi']?.iconName;
    const icon = Network[Network.primary || '']?.iconName;
    self.icon = icon || '';
    self.visible = !!icon;
});

const AudioIndicator = () => Widget.Icon().hook(Audio, self => {
    if (!Audio.speaker)
        return;

    const { muted, low, medium, high, overamplified } = icons.audio.volume;
    if (Audio.speaker.is_muted)
        return self.icon = muted;


    /** @type {Array<[number, string]>} */
    const cons = [[101, overamplified], [67, high], [34, medium], [1, low], [0, muted]];
    self.icon = cons.find(([n]) => n <= Audio.speaker.volume * 100)?.[1] || '';
}, 'speaker-changed');

const SpeakerIndicator = () => Widget.Box({
    class_name: 'system-volume',
    children: [
        AudioIndicator(),
        Widget.Label({ label: ' ' }),
        PercentLabel(),
    ],
    setup: self => self.hook(Audio, () => {
        let alreadyCreated = false;
        let isHeadsetSelected = Audio.speaker?.iconName === 'audio-headset-analog-usb';
        let classnameToDisplay = 'headset-icon';

        self.get_children().forEach(ch => {
            if (ch.class_name == classnameToDisplay) {
                if (isHeadsetSelected) {
                    ch.visible = true;
                } else {
                    ch.visible = false;
                }

                alreadyCreated = true;
            }
        });

        if (alreadyCreated) {
            return;
        }

        if (isHeadsetSelected) {
            self.add(Widget.Box({
                class_name: classnameToDisplay,
                children: [
                    Widget.Label({ label: ' ', }),
                    VolumeIndicator('speaker')
                ]
            }))
            self.show_all()
        }
    }),
});

const HeadsetInfo = () => Widget.Box({
    class_name: 'headset-indicator',
    setup: self => {
        self.poll(5000, (self) => {
            Btdevice.callHeadsetBatteryScript
            const data = Btdevice.headsetdata;
    
            self.get_children().forEach(ch => ch.destroy());
    
            data ? self.add(Widget.Box({
                class_name: 'headset-battery',
                children: [
                    // Widget.Icon({
                    //     class_name: 'headset-battery-icon',
                    //     icon: icons.audio.type.headset
                    // }),
                    Widget.Label({
                        class_name: 'headset-battery-label',
                        label: data
                    }),
                ],
            })) : null;
        });
    },
});


export default () => PanelButton({
    class_name: 'quicksettings panel-button',
    on_clicked: () => {
        App.closeWindow('quicksettings')
        App.toggleWindow('quicksettings')
    },
    setup: self => self
        .hook(App, (_, win, visible) => {
            self.toggleClassName('active', win === 'quicksettings' && visible);
        }),
    on_scroll_up: () => {
        if (Audio.speaker.volume < 0.99) {
            Audio.speaker.volume += 0.02;
        } else {
            Audio.speaker.volume = 1.0;
        }
        Indicator.speaker();
    },
    on_scroll_down: () => {
        Audio.speaker.volume -= 0.02;
        Indicator.speaker();
    },
    content: Widget.Box({
        children: [
            // Asusctl?.available && ProfileIndicator(),
            // Asusctl?.available && ModeIndicator(),
            DNDIndicator(),
            IdleIndicator(),
            NightlightIndicator(),
            // BluetoothDevicesIndicator(),
            BluetoothIndicator(),
            NetworkIndicator(),
            // AudioIndicator(),
            MicrophoneIndicator(),
            SpeakerIndicator(),
            HeadsetInfo(),
        ],
    }),
});
