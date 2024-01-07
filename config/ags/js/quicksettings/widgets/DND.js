import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Notifications from 'resource:///com/github/Aylur/ags/service/notifications.js';
import icons from '../../icons.js';
import { SimpleToggleButton } from '../ToggleButton.js';

export default () => SimpleToggleButton({
    icon: Widget.Box({
        children: [
            Widget.Icon({
                icon: Notifications.bind('dnd').transform(dnd => icons.notifications[dnd ? 'silent' : 'noisy']),
            }),
            Widget.Label({
                label: Notifications.bind('dnd').transform(dnd => {return dnd ? 'Silent' : 'Noisy'}),
            }),
        ],
    }),
    toggle: () => Notifications.dnd = !Notifications.dnd,
    connection: [Notifications, () => Notifications.dnd],
});
