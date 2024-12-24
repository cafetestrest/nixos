import FontIcon from '../../misc/FontIcon.js';
import * as vars from '../../variables.js';

import Widget from 'resource:///com/github/Aylur/ags/widget.js';

const UsagePercentageLabel = (type, title, unit) => Widget.Label({
    class_name: `label ${type}`,
    setup: self => self.hook(vars[type], () => {
        const percentage = Math.floor(vars[type].value * 100);
        self.label = `${title}${percentage}${unit}`;
    }),
});

const UsageLabel = (type, title, unit) => Widget.Label({
    class_name: `label ${type}`,
    setup: self => self.hook(vars[type], () => {
        self.label = `${title}${vars[type].value}${unit}`;
    }),
});

export const UsageCPU = () => Widget.Box({
    class_name: 'cpu usage panel-button',
    children: [
        FontIcon({
            class_name: 'icon',
            icon: '︁',
        }),
        UsagePercentageLabel('cpu', '', '%'),
    ]
});

export const UsageRAM = () => Widget.Box({
    class_name: 'ram usage panel-button',
    children: [
        FontIcon({
            class_name: 'icon',
            icon: '︁',
        }),
        UsageLabel('ramGB', '', ''),
    ]
});

export const UsageDisk = () => Widget.Box({
    class_name: 'disk usage panel-button',
    children: [
        FontIcon({
            class_name: 'icon',
            icon: '',
        }),
        UsagePercentageLabel('disk', '', '%'),
    ]
});

export const UsagePower = () => Widget.Box({
    class_name: 'power-indicator panel-button',
    setup: self => self.hook(vars['upower'], () => {
        const data = vars['upower'].value

        self.get_children().forEach(ch => ch.destroy());

        data.forEach(({ iconName, batteryPercentage }) =>
            self.add(Widget.Box({
                class_name: 'btdevice',
                children: [
                    Widget.Icon({
                        class_name: 'btdevice-icon',
                        icon: iconName,
                    }),
                    Widget.Label({
                        class_name: 'btdevice-label',
                        label: batteryPercentage !== "" ? batteryPercentage.toString() + "%" : "",
                    }),
                ],
            }))
        );
    }),
});
