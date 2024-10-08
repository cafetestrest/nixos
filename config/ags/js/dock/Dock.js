import App from 'resource:///com/github/Aylur/ags/app.js';
import Hyprland from 'resource:///com/github/Aylur/ags/service/hyprland.js';
import Applications from 'resource:///com/github/Aylur/ags/service/applications.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import icons from '../icons.js';
import options from '../options.js';
import { launchApp, range, substitute } from '../utils.js';


const focus = ({ address }) => Hyprland.messageAsync(`dispatch focuswindow address:${address}`);

/** @param {import('types/widgets/button').ButtonProps & { icon: string, pinned?: boolean }} o */
const AppButton = ({ icon, pinned = false, ...rest }) => {
    const indicators = Widget.Box({
        vpack: 'end',
        hpack: 'center',
        children: range(5, 0).map(() => Widget.Box({
            class_name: 'indicator',
            visible: false,
        })),
    });

    return Widget.Button({
        ...rest,
        attribute: indicators,
        child: Widget.Box({
            class_name: 'box',
            child: Widget.Overlay({
                child: Widget.Icon({
                    icon,
                    size: options.desktop.dock.icon_size.bind('value'),
                }),
                pass_through: true,
                overlays: pinned ? [indicators] : [],
            }),
        }),
    });
};

export const Taskbar = () => Widget.Box({
    class_name: 'taskbar',
    children: Hyprland.bind('clients').transform(c => c.map(client => {
        for (const appName of options.desktop.dock.pinned_apps.value) {
            if (client.class.toLowerCase().includes(appName.toLowerCase()))
                return null;
        }

        const substitutionsIcons = options.substitutions.icons;
        const classIcon = substitute(substitutionsIcons, client.class);

        for (const app of Applications.list) {
            if (client.class && (app.match(client.class) || app.icon_name === classIcon)) {
                return AppButton({
                    icon: app.icon_name || '',
                    tooltip_text: app.name,
                    on_primary_click: () => focus(client),
                    on_middle_click: () => launchApp(app),
                });
            }
        }
    })),
});

const PinnedApps = () => Widget.Box({
    class_name: 'pins',
    homogeneous: true,
    children: options.desktop.dock.pinned_apps.bind('value').transform(v => v
        .map(term => ({ app: Applications.query(term)?.[0], term }))
        .filter(({ app }) => app)
        .map(({ app, term }) => AppButton({
            pinned: true,
            icon: app.icon_name || '',
            on_primary_click: () => {
                for (const client of Hyprland.clients) {
                    if (client.class.toLowerCase().includes(term))
                        return focus(client);
                }

                launchApp(app);
            },
            on_middle_click: () => launchApp(app),
            tooltip_text: app.name,
            setup: button => button.hook(Hyprland, () => {
                const running = Hyprland.clients
                    .filter(client => client.class.toLowerCase().includes(term));

                const focused = running.find(client =>
                    client.address === Hyprland.active.client.address);

                const index = running.findIndex(c => c === focused);

                for (let i = 0; i < 5; ++i) {
                    const indicator = button.attribute.children[i];
                    indicator.visible = i < running.length;
                    indicator.toggleClassName('focused', i === index);
                }

                button.set_tooltip_text(running.length === 1 ? running[0].title : app.name);
            }),
        })),
    ),
});

export default () => {
    const pinnedapps = PinnedApps();
    const taskbar = Taskbar();
    const applauncher = AppButton({
        class_name: 'launcher nonrunning',
        icon: icons.apps.apps,
        tooltip_text: 'Applications',
        on_clicked: () => App.toggleWindow('applauncher'),
    });
    const separator = Widget.Separator({
        vpack: 'center',
        hpack: 'center',
        orientation: 1,
        setup: self => self.hook(taskbar, () => {
            self.visible = taskbar.children.length > 0;
        }, 'notify::children'),
    });
    return Widget.Box({
        class_name: 'dock',
        children: [applauncher, pinnedapps, separator, taskbar],
    });
};
