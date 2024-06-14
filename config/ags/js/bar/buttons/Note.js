import icons from '../../icons.js';
import PanelButton from '../PanelButton.js';
// import Note from '../../services/note.js';

import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';

// let first = false;

export default () => PanelButton({
    class_name: 'panel-button note',
    content: Widget.Icon({
        icon: icons.note,
    }),
    on_clicked: () => {
        Utils.execAsync(['bash', '-c', "codium ~/Documents/note.md"]).catch(print);
    },
    on_secondary_click: () => {
        Utils.execAsync(['bash', '-c', "codium ~/Documents/note.md"]).catch(print);
    },
});
