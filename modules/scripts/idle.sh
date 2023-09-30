#!/usr/bin/env bash

function lock() {
    gtklock -d
}

function sespend() {
    lock
    sleep 0.1
    systemctl suspend
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

        if pgrep -x "gtklock" >/dev/null; then
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
