#!/usr/bin/env bash

function lock() {
    # gtklock -d
    swaylock -f
}

function sespend() {
    if pgrep -x "swaylock" >/dev/null; then
        systemctl suspend
    else
        lock
        sleep 0.2
        systemctl suspend
    fi
}

function checkIfMediaIsPlayingAndLock() {
    status=$(playerctl status 2> /dev/null)

    if [ "$status" != "Playing" ]; then
        lock
    fi
}

function checkIfMediaIsPlayingAndSespend() {
    status=$(playerctl status 2> /dev/null)

    if [ "$status" != "Playing" ]; then
        sespend
    fi
}

function pauseMedia() {
    playerctl pause
}

function idle_action() {
    # Check if media is playing
    status=$(playerctl status 2> /dev/null)

    if [ "$status" != "Playing" ]; then

        if pgrep -x "swaylock" >/dev/null; then
            sespend
        else
            lock
        fi
    fi
}

firstArgLetter="$(echo "$1")"
if [ -z $firstArgLetter ]; then
    idle_action
else
    if [[ $firstArgLetter == "l" ]]; then
        pauseMedia
        lock
    elif [[ $firstArgLetter == "s" ]]; then
        pauseMedia
        sespend
    elif [[ $firstArgLetter == "g" ]]; then
        checkIfMediaIsPlayingAndLock
    elif [[ $firstArgLetter == "z" ]]; then
        checkIfMediaIsPlayingAndSespend
    else
        echo 'Unknown command'
        exit 1
    fi
fi
