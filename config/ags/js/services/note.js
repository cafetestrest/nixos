import Service from 'resource:///com/github/Aylur/ags/service.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';

class Note extends Service {
    static { Service.register(this); }

    get callNote() {
        Utils.execAsync(['bash', '-c', "note ags"]).catch(print);
        // this.emit('changed');
    }

    constructor() {
        super();
        this._note = null;
    }

    get note() { return this._note; }
    setNote(text) { this._note = text; }
}

export default new Note();
