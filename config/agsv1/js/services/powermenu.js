import App from 'resource:///com/github/Aylur/ags/app.js';
import Service from 'resource:///com/github/Aylur/ags/service.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';

class PowerMenu extends Service {
    static {
        Service.register(this, {}, {
            'title': ['string'],
            'cmd': ['string'],
        });
    }

    #title = '';
    #cmd = '';

    get title() { return this.#title; }
    get cmd() { return this.#cmd; }

    /** @param {'sleep' | 'reboot' | 'logout' | 'shutdown'} action */
    action(action) {
        [this.#cmd, this.#title] = {
            'lock': [`idle l`, 'Lock'],
            'sleep': [`idle s`, 'Sleep'],
            'reboot': ['systemctl reboot', 'Reboot'],
            'logout': [`loginctl terminate-user ${Utils.USER}`, 'Log Out'],
            'shutdown': ['shutdown now', 'Shutdown'],
        }[action];

        this.notify('cmd');
        this.notify('title');
        this.emit('changed');
        App.closeWindow('powermenu');
        // App.openWindow('verification');
        Utils.exec(this.#cmd);
    }
}

export default new PowerMenu();
