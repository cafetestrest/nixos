function lock() {
    # gtklock -d
    # swaylock -f
    # hyprlock
    loginctl lock-session
}

function lock_with_hyprlock() {
    if ! tty | grep -q '^/dev/tty[0-9]\+'; then
        pidof hyprlock || hyprlock > /dev/null 2>&1 &
    fi
}

function sespend() {
    if [ -n "$(whereis swayidle | awk '{print $2}')" ]; then
        if ! pgrep -x "swayidle" >/dev/null; then
            lock_with_hyprlock
            sleep 0.2
        fi
    fi

    if [ -n "$(whereis hypridle | awk '{print $2}')" ]; then
        if ! pgrep -x "hypridle" >/dev/null; then
            lock_with_hyprlock
            sleep 0.2
        fi
    fi

    systemctl suspend
}

function checkIfMediaIsPlayingAndLock() {
    status=$(playerctl status 2>&1 || true)

    if [ "$status" != "Playing" ]; then
        lock
    fi
}

function checkIfMediaIsPlayingAndSespend() {
    status=$(playerctl status 2>&1 || true)

    if [ "$status" != "Playing" ]; then
        sespend
    fi
}

function pauseMedia() {
    status=$(playerctl status 2>&1 || true)

    if [ "$status" == "Playing" ]; then
        playerctl pause
        echo "paused playing media"
    fi
}

function idle_action() {
    # Check if media is playing
    status=$(playerctl status 2>&1 || true)

    if [ "$status" != "Playing" ]; then

        if pgrep -x "hyprlock" >/dev/null; then
            sespend
        else
            lock
        fi
    fi
}

#checks the first letter of the argument provided to the script
if [[ $# -ge 1 ]]; then
    firstArgLetter="$(echo "$1" | head -c 1)"
else
    firstArgLetter=
fi

if [ -z "$firstArgLetter" ]; then
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
