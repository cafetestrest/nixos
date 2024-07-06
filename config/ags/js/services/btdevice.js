import Service from 'resource:///com/github/Aylur/ags/service.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';

class BtDevice extends Service {
    static { Service.register(this); }

    constructor() {
        super();
        this._data = null;
        this._headsetdata = null;
        // this.call();
    }

    call() {
        if (!this._data) {
            Utils.execAsync(['bash', '-c', "sleep 5 && bluetoothbatterypercentage ags"]).catch(console.error);
        } else {
            Utils.execAsync(['bash', '-c', "bluetoothbatterypercentage ags"]).catch(console.error);
        }
    }

    callHeadset() {
        Utils.execAsync(['bash', '-c', "headset ags"]).catch(console.error);
    }

    get callBtDeviceInfoScript() {
        this.call()
        return this._data;
    }

    get callHeadsetBatteryScript() {
        this.callHeadset()
        return this._data;
    }

    get data() { return this._data; }
    setData(text) { this._data = text }

    get headsetdata() { return this._headsetdata; }
    setHeadsetData(text) { this._headsetdata = text }
}

export default new BtDevice();
