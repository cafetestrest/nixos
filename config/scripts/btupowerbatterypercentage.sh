
devices=$(upower -e)
output=""
Ags=0

if [[ $# -ge 1 ]]; then
    firstArgLetter="$(echo "$1" | head -c 1)"
else
    firstArgLetter=
fi

if [[ $firstArgLetter == "a" ]]; then
    Ags=1
fi

ags -r "btdevice.setUpowerData([])"

if [ -z "$devices" ]; then
    ags -r "btdevice.setUpowerData([])"
    echo "No devices found."
    exit 1
fi

for device in $devices; do
    if upower -i "$device" | grep -qE "keyboard"; then
        battery_level=$(upower -i "$device" | grep "percentage" | awk '{print $2}' | tr -d '%')
        output+="{\"iconName\":\"input-keyboard\",\"batteryPercentage\":\"$battery_level\"},"
    elif upower -i "$device" | grep -qE "mouse"; then
        battery_level=$(upower -i "$device" | grep "percentage" | awk '{print $2}' | tr -d '%')
        output+="{\"iconName\":\"input-mouse\",\"batteryPercentage\":\"$battery_level\"},"
    fi
done

if [ -z "$output" ]; then
    ags -r "btdevice.setUpowerData([])"
    echo "No data to output."
    exit 1
fi

if [ "${output: -1}" = "," ]; then
    output="${output%,}"
fi

output="[$output]"

if [ "$Ags" == "1" ]; then
    ags -r "btdevice.setUpowerData($output)"
else
    echo "$output"
fi
