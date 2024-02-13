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
