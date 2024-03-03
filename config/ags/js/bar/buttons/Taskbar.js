import Hyprland from 'resource:///com/github/Aylur/ags/service/hyprland.js';
import Applications from 'resource:///com/github/Aylur/ags/service/applications.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import PanelButton from '../PanelButton.js';
import { launchApp } from '../../utils.js';
import icons from '../../icons.js';

import options from '../../options.js';
import { substitute } from '../../utils.js';

const focus = ({ address }) => Hyprland.messageAsync(`dispatch focuswindow address:${address}`);

/** @param {import('types/widgets/box').default} box */
const setChildren = box => box.children = Hyprland.clients.map(client => {
    if (Hyprland.active.workspace.id !== client.workspace.id)
        return;

    const substitutionsIcons = options.substitutions.icons;
    const classIcon = substitute(substitutionsIcons, client.class);

    for (const app of Applications.list) {
        if (client.class && (app.match(client.class) || app.icon_name === classIcon)) {
            return PanelButton({
                content: Widget.Icon(app.icon_name || icons.fallback.executable),
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
