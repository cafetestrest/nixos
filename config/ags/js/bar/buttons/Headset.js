import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Btdevice from '../../services/btdevice.js';
import icons from '../../icons.js';

export default () => Widget.Box({
    class_name: 'headset-indicator panel-button',
    setup: self => {
        self.poll(5000, (self) => {
            Btdevice.callHeadsetBatteryScript
            const data = Btdevice.headsetdata;
    
            self.get_children().forEach(ch => ch.destroy());
    
            data ? self.add(Widget.Box({
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
        });
    },
});
