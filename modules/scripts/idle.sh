#!/usr/bin/env bash

function lock() {
    gtklock -d
}

function sespend() {
    # lock
    # sleep 1
    systemctl suspend
}

function pauseMedia() {
    playerctl pause
}

function idle_action() {
    # Check if media is playing
    status=$(playerctl status 2> /dev/null)

    if [ "$status" != "Playing" ]; then

        if pgrep -x "gtklock" >/dev/null; then
            sespend
        else
            lock
        fi
    fi
}

firstArgLetter="$(echo "$1" | head -c 1)"
if [ -z $firstArgLetter ]; then
    idle_action
else
    if [[ $firstArgLetter == "l" ]]; then
        pauseMedia
        lock
    elif [[ $firstArgLetter == "s" ]]; then
        pauseMedia
        sespend
    else
        echo 'Unknown command'
        exit 1
    fi
fi
