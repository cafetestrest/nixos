import Service from 'resource:///com/github/Aylur/ags/service.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';

class Nightlight extends Service {
    static { Service.register(this); }

    _mode = '';

    get mode() { return this._mode; }

    set mode(value) {
        if (this._mode === "auto") {
            Utils.execAsync(['bash', '-c', "nightlight enable"]).catch(print);
            this._mode = "on";
        } else if (this._mode === "on") {
            Utils.execAsync(['bash', '-c', "nightlight disable"]).catch(print);
            this._mode = "off";
        } else {
            Utils.execAsync(['bash', '-c', "nightlight automatic"]).catch(print);
            this._mode = "auto";
        }

        this.emit('changed');
    }

    constructor() {
        super();

        this._mode = Utils.exec('pidof wlsunset') ? 'auto' : 'off';
    }
}

export default new Nightlight();
