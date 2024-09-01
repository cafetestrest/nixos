import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import App from 'resource:///com/github/Aylur/ags/app.js';
import icons from '../../icons.js';
import PanelButton from '../PanelButton.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';

export default () => PanelButton({
    class_name: 'powermenu',
    content: Widget.Icon(icons.powermenu.shutdown),
    on_clicked: () => App.openWindow('powermenu'),
    on_secondary_click: () => Utils.execAsync(['bash', '-c', "openstartupapps"]).catch(print),
});
