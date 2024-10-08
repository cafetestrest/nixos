import App from 'resource:///com/github/Aylur/ags/app.js';
import PanelButton from '../PanelButton.js';
import FontIcon from '../../misc/FontIcon.js';
import { distroIcon } from '../../variables.js';
import options from '../../options.js';

export default () => PanelButton({
    class_name: 'overview',
    window: 'overview',
    on_clicked: () => App.toggleWindow('applauncher'),
    on_secondary_click: () => App.toggleWindow('applauncher'),
    content: FontIcon({
        label: options.bar.icon.bind('value').transform(v => {
            return v === 'distro-icon' ? distroIcon : v;
        }),
    }),
});
