#!/usr/bin/env bash

disable() {
    killall -9 wlsunset
}

enable() {
    wlsunset -t 3500 -S 06:00 -s 06:01
}

automatic() {
    wlsunset -t 3500 -l 39.07 -L 21.82
}

toggle() {
    if pidof wlsunset; then
        disable
    else
        enable
    fi
}

firstArgLetter="$(echo "$1" | head -c 1)"

if [ -z $firstArgLetter ]; then
    automatic
else
    if [[ $firstArgLetter == "d" ]]; then
        disable
    elif [[ $firstArgLetter == "e" ]]; then
        enable
    elif [[ $firstArgLetter == "t" ]]; then
        toggle
    elif [[ $firstArgLetter == "a" ]]; then
        automatic
    else
        automatic
    fi
fi
