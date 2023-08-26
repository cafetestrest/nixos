#!/usr/bin/env bash

function idle_action() {
    # Check if media is playing
    status=$(playerctl status 2> /dev/null)

    function sespend() {
        systemctl suspend
    }

    function lock() {
        gtklock -d
    }

    if [ "$status" != "Playing" ]; then

        if pgrep -x "gtklock" >/dev/null; then
            sespend
        else
            lock
        fi
    fi
}

idle_action
