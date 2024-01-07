import Hyprland from 'resource:///com/github/Aylur/ags/service/hyprland.js';
import Applications from 'resource:///com/github/Aylur/ags/service/applications.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import PanelButton from '../PanelButton.js';
import { launchApp } from '../../utils.js';
import icons from '../../icons.js';

const focus = ({ address }) => Hyprland.sendMessage(`dispatch focuswindow address:${address}`);

/** @param {import('types/widgets/box').default} box */
const setChildren = box => box.children = Hyprland.clients.map(client => {
    if (Hyprland.active.workspace.id !== client.workspace.id)
        return;

    const iconNames = {
        'jetbrains-phpstorm': 'phpstorm',
        // 'Rofi': 'rofi',
    };

    for (const app of Applications.list) {
        if ((client.class && app.match(client.class)) || iconNames.hasOwnProperty(client.class)) {
            let newIcon = false;

            if (iconNames.hasOwnProperty(client.class)) {
                newIcon = iconNames[client.class]
            }

            return PanelButton({
                content: Widget.Icon(newIcon === false ? app.icon_name || icons.fallback.executable : newIcon),
                tooltip_text: app.name,
                on_primary_click: () => focus(client),
                on_middle_click: () => launchApp(app),
            });
        }
    }
});

export default () => Widget.Box()
    .hook(Hyprland, setChildren, 'notify::clients')
    .hook(Hyprland, setChildren, 'notify::active');
