import icons from '../../icons.js';
import PanelButton from '../PanelButton.js';

import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';

export default () => PanelButton({
    class_name: 'panel-button screenshot',
    content: Widget.Icon({
        icon: icons.screenshot,
    }),
    on_clicked: () => {
        Utils.execAsync(['bash', '-c', "screenshot 1"]).catch(print);
    },
    on_secondary_click: () => {
        Utils.execAsync(['bash', '-c', "screenshot"]).catch(print);
    },
});
