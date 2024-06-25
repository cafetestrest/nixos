connectedDevices=$(bluetoothctl devices Connected)
output=""
Ags=0

#checks the first letter of the argument provided to the script
if [[ $# -ge 1 ]]; then
    firstArgLetter="$(echo "$1" | head -c 1)"
else
    firstArgLetter=
fi

if [[ $firstArgLetter == "a" ]]; then
    Ags=1
fi

# Check if any devices are connected
if [[ -n "$connectedDevices" ]]; then
    # Extract the device IDs
    mapfile -t deviceIds < <(echo "$connectedDevices" | grep "Device" | awk '{print $2}')

    # Loop through the device IDs and retrieve device info
    for device_id in "${deviceIds[@]}"; do
        deviceInfo=$(bluetoothctl info "$device_id")

        # Extract the device name, icon and battery percentage
        # device_name=$(echo "$deviceInfo" | grep "Name" | awk '{print $2}')
        iconName=$(echo "$deviceInfo" | grep "Icon" | awk '{print $2}')
        batteryPercentage=$(echo "$deviceInfo" | grep "Battery Percentage:" | awk '{print $4}' | tr -cd '[:digit:]')

        if [[ $iconName ]]; then
            output+="{\"iconName\":\"$iconName\",\"batteryPercentage\":\"$batteryPercentage\"},"
        fi
    done
fi

if [ -z "$output" ]; then
    exit 1
fi

if [ "${output: -1}" = "," ]; then
    output="${output%,}"
fi

output="[$output]"

if [ "$Ags" == "1" ]; then
    ags -r "btdevice.setData($output)"
else
    echo "$output"
fi
