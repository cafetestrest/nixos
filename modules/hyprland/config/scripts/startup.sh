#!/usr/bin/env bash

function open_apps() {
    hyprctl dispatch exec "[workspace 1]" chromium

    sleep 0.2

    hyprctl dispatch exec "[workspace 1]" "terminator --working-directory ~/nixos"

    sleep 0.9

    hyprctl dispatch movefocus r

    sleep 0.2

    hyprctl dispatch exec "[workspace 1]" "codium ~/nixos/"

    sleep 0.9

    hyprctl dispatch movewindow d
}

function is_playing_media()
{
    max_duration=20  # Maximum duration to check (in seconds)
    interval=1     # Interval between checks (in seconds)
    elapsed=0        # Elapsed time counter

    while [ $elapsed -lt $max_duration ]; do
        status=$(playerctl status)

        if [ "$status" = "Playing" ]; then
            playerctl pause
            break
        fi

        sleep 0.5
        elapsed=$(bc <<< "$elapsed + $interval")
    done
}

open_apps
is_playing_media
