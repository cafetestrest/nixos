import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Bluetooth from 'resource:///com/github/Aylur/ags/service/bluetooth.js';

// This one is relying on ags Bluetooth service to provice information and is quicker but does not show battery percentage without gnome
export default () => Widget.Box({
    class_name: 'bluetooth-indicator panel-button',
}).hook(Bluetooth, box => {
    box.children = Bluetooth.connectedDevices
        .map(({ iconName, batteryPercentage }) => Widget.Box({
            class_name: 'btdevice',
            children: [
                Widget.Icon({
                    class_name: 'btdevice-icon',
                    icon: iconName + '-symbolic',
                }),
                Widget.Label({
                    class_name: 'btdevice-label',
                    label: batteryPercentage !== 0 ? batteryPercentage.toString() + "%" : ""
                }),
            ],
        }));

    box.visible = Bluetooth.connectedDevices.length > 0;
}, 'notify::connected-devices');
