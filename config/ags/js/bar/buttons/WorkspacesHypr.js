import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';
import Hyprland from 'resource:///com/github/Aylur/ags/service/hyprland.js';

export default () => Widget.Box({
    class_name: 'hyprworkspaces panel-button',
    connections: [[Hyprland, box => {
        // remove every children
        box.get_children().forEach(ch => ch.destroy());

        // add a button for each workspace
        const numberOfWorkspaces = 10;

        for (let i = 1; i <= numberOfWorkspaces; ++i) {
            if (Hyprland.getWorkspace(i)?.id !== i) {
                continue;
            }

            let wsnum = i;
            if (i === 10) {
                wsnum = 0;
            }

            box.add(Widget.Box({
                class_name: 'box-around-workspaces',
                children: [
                    Widget.Button({
                        on_clicked: () => Utils.execAsync(`hyprctl dispatch workspace ${i}`).catch(print),
                        onScrollUp: () => Utils.execAsync(`hyprctl dispatch workspace +1`).catch(print),
                        onScrollDown: () => Utils.execAsync(`hyprctl dispatch workspace -1`).catch(print),
                        child: Widget.Label(`${wsnum.toString()}`),
                        class_name: Hyprland.active.workspace.id == i ? 'focused' : '',
                    })
                ]
            }));
        }

        // make the box render it
        box.show_all();
    }]],
});
