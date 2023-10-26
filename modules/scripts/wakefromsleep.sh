#!/usr/bin/env bash

function refresh_ags_bluetooth_connected_devices() {
    if pgrep ags; then
        ags run-js "$(cat ~/.config/scripts/resetbluetoothags.js)"
    fi
}

function refresh_ags_weather_info() {
    if pgrep ags; then
        ~/.config/scripts/111.sh ags
    fi
}


# check if the PC is unlocked - gtklock not running for max duration defined below
max_duration=60     # Maximum duration to check - seconds
interval=5          # Interval between checks
elapsed=0           # Elapsed time counter

sleep $interval

while [ $elapsed -lt $max_duration ]; do
    if ! pgrep gtklock; then
        # commands to run if unlocked
        refresh_ags_bluetooth_connected_devices

        refresh_ags_weather_info
        break
    fi

    sleep $interval
    elapsed=$(bc <<< "$elapsed + $interval")
done

# echo 'done'
