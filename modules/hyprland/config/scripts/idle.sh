#!/usr/bin/env bash

# Check if media is playing
status=$(playerctl status 2> /dev/null)

function sespend() {
    systemctl suspend
}

function lock() {
    gtklock -d
}

if [ "$status" != "Playing" ]; then

    if [ "$#" -eq  "0" ]
    then
        lock
    else
        sespend
    fi
fi
