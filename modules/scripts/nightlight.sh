#!/usr/bin/env bash

disable() {
    killall -9 wlsunset
}

enable() {
    disable
    wlsunset -t 3500 -S 06:00 -s 06:00
}

automatic() {
    disable
    nohup wlsunset -t 3500 -l 39.07 -L 21.82 > /dev/null 2>&1 &
}

automatic_winter() {
    # echo "Winter time"
    disable
    nohup wlsunset -t 3500 -l 55.16 -L 10.45 > /dev/null 2>&1 &
}

toggle() {
    if pidof wlsunset; then
        disable
    else
        enable
    fi
}

monthlyAuto() {
    # Get the current month in two-digit format (01 for January, 02 for February, etc.)
    current_month=$(date +'%m')

    # Display the current month
    # echo "Current Month: $current_month"

    # Case statement to perform actions based on the current month
    case $current_month in
        12|01|02) automatic_winter;;
        *) automatic;;
    esac
}

#checks the first letter of the argument provided to the script
firstArgLetter="$(echo "$1" | head -c 1)"

if [ -z $firstArgLetter ]; then
    monthlyAuto
else
    if [[ $firstArgLetter == "d" ]]; then
        disable
    elif [[ $firstArgLetter == "e" ]]; then
        enable
    elif [[ $firstArgLetter == "t" ]]; then
        toggle
    elif [[ $firstArgLetter == "a" ]]; then
        monthlyAuto
    else
        monthlyAuto
    fi
fi
