import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import icons from '../icons.js';
import PowerMenu from '../services/powermenu.js';
import ShadedPopup from './ShadedPopup.js';

/**
 * @param {'sleep' | 'reboot' | 'logout' | 'shutdown'} action
 * @param {string} label
 */
const SysButton = (action, label) => Widget.Button({
    on_clicked: () => PowerMenu.action(action),
    child: Widget.Box({
        vertical: true,
        children: [
            Widget.Icon({
                icon: icons.powermenu[action],
                size: 35,
            }),
            // Widget.Label(label),
        ],
    }),
});

export default () => ShadedPopup({
    name: 'powermenu',
    expand: true,
    child: Widget.Box({
        children: [
            SysButton('lock', 'Lock'),
            SysButton('sleep', 'Sleep'),
            SysButton('logout', 'Log Out'),
            SysButton('reboot', 'Reboot'),
            SysButton('shutdown', 'Shutdown'),
        ],
    }),
});
