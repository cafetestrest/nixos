import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';

const ToggleLights = () => Widget.Box({
    class_name: 'toggle-lights',
    children: [
        Widget.Box({ hexpand: true, }),
        Widget.Button({
            class_name: 'on',
            on_clicked: box => {
                Utils.execAsync(['bash', '-c', "~/.config/scripts/yeelight/yeelight-scene.sh 0 On"])
                    .catch(console.error);
            },
            child: Widget.Box({
                class_name: 'on-inner',
                children: [
                    Widget.Label('ON'),
                ],
            }),
        }),
        Widget.Button({
            class_name: 'off',
            on_clicked: box => {
                Utils.execAsync(['bash', '-c', "~/.config/scripts/yeelight/yeelight-scene.sh 0 Off"])
                    .catch(console.error);
            },
            child: Widget.Box({
                class_name: 'off-inner',
                children: [
                    Widget.Label('OFF'),

                ],
            }),
        }),
        Widget.Box({ hexpand: true, }),
    ],
});

const ColorTempSlider = () => Widget.Slider({
    class_name: 'color-temp slider',
    draw_value: false,
    min: 1700,
    max: 6500,
    marks: [
        [1700, '1700', 'bottom'],
        [3500, '3500', 'bottom'],
        [4500, '4500', 'bottom'],
        [6500, '6500', 'bottom'],
    ],
    on_change: ({ value }) => {
        function triggerFunction(value) {
            // Convert the value to a flat number using Math.floor
            const flatNumber = Math.floor(value);
          
            // Check if the flat number is within the range or equal to (1700 to 6500) and a multiple of 20
            if ((flatNumber === 1700 || flatNumber === 6500) ||
                (flatNumber >= 1700 && flatNumber <= 6500 && flatNumber % 20 === 0)) {
                // console.log('temp ' + flatNumber)

                Utils.execAsync(['bash', '-c', `~/.config/scripts/yeelight/yeelight-colortemp.sh 0 ${flatNumber}`]).catch(console.error);   
            }
        }

        return triggerFunction(value);
    },
    // setup: self => self.hook(Audio, () => {
    //     self.value = Audio[type]?.volume || 0;
    // }, `${type}-changed`),
});

const HueSlider = () => Widget.Slider({
    class_name: 'hue slider',
    draw_value: false,
    min: 0,
    max: 359,
    marks: [
        [0, 'min', 'bottom'],
        [359, 'max', 'bottom'],
    ],
    on_change: ({ value }) => {
        function triggerFunction(value) {
            // Convert the value to a flat number using Math.floor
            const flatNumber = Math.floor(value);
          
            // Check if the flat number is within the range (0 to 359) and a multiple of 6 to lower down spam to lights
            if (flatNumber >= 0 && flatNumber <= 359 && flatNumber % 6 === 0) {
                // console.log('hue ' + flatNumber)

                Utils.execAsync(['bash', '-c', `~/.config/scripts/yeelight/yeelight-hue.sh 0 ${flatNumber} 100`]).catch(console.error);   
            }
        }

        return triggerFunction(value);
    },
});

const BrightnessSlider = () => Widget.Slider({
    class_name: 'brightness slider',
    draw_value: false,
    min: 0,
    max: 100,
    marks: [
        [0, '0', 'bottom'],
        [100, '100', 'bottom'],
    ],
    on_change: ({ value }) => {
        function triggerFunction(value) {
            // Convert the value to a flat number using Math.floor
            const flatNumber = Math.floor(value);
          
            // Check if the flat number is within the range or equal to (0 to 100) and a multiple of 10
            if ((flatNumber === 0 || flatNumber === 100) ||
                (flatNumber >= 0 && flatNumber <= 100 && flatNumber % 10 === 0)) {
                // console.log('brightness ' + flatNumber)

                Utils.execAsync(['bash', '-c', `~/.config/scripts/yeelight/yeelight-brightness.sh 0 ${flatNumber}`]).catch(console.error);   
            }
        }

        return triggerFunction(value);
    },
});

export default () => Widget.Box({
    vertical: true,
    class_name: 'led-light-color-switcher',
    children: [
        ToggleLights(),
        ColorTempSlider(),
        HueSlider(),
        BrightnessSlider(),
    ],
});
