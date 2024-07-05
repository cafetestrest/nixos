function refresh_ags_bluetooth_connected_devices() {
    if pgrep ags; then
        ags -r "$(cat "$HOME"/.config/scripts/resetbluetoothags.js)"
    fi
}

function refresh_ags_weather_info() {
    if pgrep ags; then
        openweathermap ags
    fi
}

function refresh_nightlight() {
    if pgrep wlsunset; then
        nightlight a
    fi
}

# check if the PC is unlocked - gtklock not running for max duration defined below
max_duration=60     # Maximum duration to check - seconds
interval=5          # Interval between checks
elapsed=0           # Elapsed time counter

sleep $interval

while [ "$elapsed" -lt "$max_duration" ]; do
    if ! pgrep hyprlock; then
        # commands to run if unlocked
        refresh_ags_bluetooth_connected_devices

        refresh_ags_weather_info

        refresh_nightlight
        break
    fi

    sleep $interval
    elapsed=$(bc <<< "$elapsed + $interval")
done

# echo 'done'
