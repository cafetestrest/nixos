batteryPercent=""
chatMix=""
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

deviceInfo=$(headsetcontrol -o env);

batteryPercent=$(echo "$deviceInfo" | grep DEVICE_0_BATTERY_LEVEL | cut -d'=' -f2)
chatMix=$(echo "$deviceInfo" | grep DEVICE_0_CHATMIX | cut -d'=' -f2)

if [[ "0" != "$batteryPercent" ]]; then
    output="$batteryPercent% | $chatMix"
fi

if [ "$Ags" == "1" ]; then
    ags -r "btdevice.setHeadsetData('$output')"
else
    echo "$output"
fi
