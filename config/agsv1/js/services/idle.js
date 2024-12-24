import Service from 'resource:///com/github/Aylur/ags/service.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';

class Idle extends Service {
    static { Service.register(this); }

    _mode = '';

    get mode() { return this._mode; }

    set mode(value) {
        this._mode = value;

        Utils.execAsync(['bash', '-c', "toggleidle toggle"]).catch(print);
        this.emit('changed');
	}

    constructor() {
        super();
        this._mode = Utils.exec('pidof hypridle') ? 'on' : 'off';
    }
}

export default new Idle();
