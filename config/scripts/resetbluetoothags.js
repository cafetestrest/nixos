const path = 'resource:///com/github/Aylur/ags/service/bluetooth.js';

import(path).then(({ default: bluetooth }) => {
    bluetooth._getDevices().forEach(d => {
        bluetooth._deviceRemoved(null, d.get_object_path());
        bluetooth._deviceAdded(null, d);
    });
});
