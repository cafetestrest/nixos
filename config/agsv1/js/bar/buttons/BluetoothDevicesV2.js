import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Bluetooth from 'resource:///com/github/Aylur/ags/service/bluetooth.js';

// This one is relying on ags Bluetooth service to provice information and is quicker but does not show battery percentage without gnome
export default () => Widget.Box({
    class_name: 'power-indicator panel-button',
}).hook(Bluetooth, box => {
    box.children = Bluetooth._getDevices()
        .map(({ name, connected, paired, trusted, batteryPercentage }) => {
            if (connected && paired && trusted) {
                let icon_name = 'bluetooth-active';
                if (name.includes('100')) {
                    icon_name = 'input-keyboard'
                } else if (name.includes('V2')) {
                    icon_name = 'input-mouse'
                } else if (name.includes('uds')) {
                    icon_name = 'audio-headphones'
                }

                return Widget.Box({
                    class_name: 'btdevice',
                    children: [
                        Widget.Icon({
                            class_name: `btdevice-icon`,
                            icon: icon_name + '-symbolic',
                        }),
                        Widget.Label({
                            class_name: 'btdevice-label',
                            label: batteryPercentage !== 0 ? batteryPercentage.toString() + "%" : ""
                        }),
                    ],
                })
            }
        }
    );

    box.visible = Bluetooth.connectedDevices.length > 0;
}, 'notify::connected-devices');
