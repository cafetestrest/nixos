const path = 'resource:///com/github/Aylur/ags/service/bluetooth.js';

import(path).then(({ default: bluetooth }) => {
    bluetooth._getDevices().forEach(d => {
        bluetooth._deviceRemoved(null, d);
        bluetooth._deviceAdded(null, d);
    });
});
