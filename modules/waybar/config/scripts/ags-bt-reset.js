const { instance } = ags.Service.Bluetooth;

instance._getDevices().forEach(d => {
    instance._deviceRemoved(null, d);
});

instance._getDevices().forEach(d => {
    instance._deviceAdded(null, d);
});
