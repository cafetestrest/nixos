#!/usr/bin/env bash

function idle_action() {
    # Check if media is playing
    status=$(playerctl status 2> /dev/null)

    function sespend() {
        hyprctl dispatch movecursor 1920 1220
        systemctl suspend
    }

    function lock() {
        hyprctl dispatch movecursor 1920 1220
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
