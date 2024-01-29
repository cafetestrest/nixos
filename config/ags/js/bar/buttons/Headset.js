import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Btdevice from '../../services/btdevice.js';
import icons from '../../icons.js';

export default () => Widget.Box({
    class_name: 'headset-indicator panel-button',
    connections: [[5000, box => {
        Btdevice.callHeadsetBatteryScript
        const data = Btdevice.headsetdata;

        box.get_children().forEach(ch => ch.destroy());

        data ? box.add(Widget.Box({
            class_name: 'headset-battery',
            children: [
                Widget.Icon({
                    class_name: 'headset-battery-icon',
                    icon: icons.audio.type.headset
                }),
                Widget.Label({
                    class_name: 'headset-battery-label',
                    label: data
                }),
            ],
        })) : null;
    }]],
});
