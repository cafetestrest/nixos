import Service from 'resource:///com/github/Aylur/ags/service.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';

class BtDeviceInfo extends Service {
    static { Service.register(this); }

    constructor() {
        super();
        this._data = null;
        // this.call();
    }

    call() {
        if (!this._data) {
            Utils.execAsync(['bash', '-c', "sleep 5 && ~/.config/scripts/bluetoothbatterypercentage.sh ags"]).catch(console.error);
        } else {
            Utils.execAsync(['bash', '-c', "~/.config/scripts/bluetoothbatterypercentage.sh ags"]).catch(console.error);
        }
    }

    get callBtDeviceInfoScript() {
        this.call()
        return this._data;
    }

    get data() { return this._data; }
    setData(text) { this._data = text }
}

export default new BtDeviceInfo();
