#!/usr/bin/env bash

batteryPercent=""
chatMix=""
output=""
Ags=0

firstArg="$(echo "$1")"

if [[ $firstArg == "ags" ]]; then
    Ags=1
fi

if [[ $firstArg == "a" ]]; then
    Ags=1
fi

batteryPercent=$(headsetcontrol -b -c);

if [[ "0" != "$batteryPercent" ]]; then
    chatMix=$(headsetcontrol -c -m);
    output="$batteryPercent% | $chatMix"
fi

if [ "$Ags" == "1" ]; then
    ags -r "btdevice.setHeadsetData('$output')"
else
    echo $output
fi
