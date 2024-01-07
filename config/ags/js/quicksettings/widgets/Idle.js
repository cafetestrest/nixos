import Idle from '../../services/idle.js';
import { SimpleToggleButton } from '../ToggleButton.js';
import icons from '../../icons.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';

export const IdleIndicator = () => Widget.Icon({
    connections: [[Idle, icon => {
        icon.icon = Idle.mode == 'on'
            ? icons.idle.on
            : icons.idle.off;
    }]],
});

export const IdleToggle = () => SimpleToggleButton({
    icon: Widget.Box({
        children: [
            IdleIndicator(),
            Widget.Label({
                connections: [[Idle, label => {
                    label.label = Idle.mode == 'on' ? 'Timeout' : 'Always On';
                }]],
            }),
        ]
    }),
    toggle: () => {
        if (Idle.mode == 'on') {
            Idle.mode = 'off';
        } else {
            Idle.mode = 'on';
        }
    },
    connection: [Idle, () => Idle.mode == 'on']
});
