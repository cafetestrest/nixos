#!/usr/bin/env bash

#night light
function run_nightligh() {
    echo 'running nightlight - wlsunset'
    # nohup wlsunset -t 3500 -l 39.07 -L 21.82 > /dev/null 2>&1 &
    ~/.config/scripts/nightlight.sh
}

function set_swaybg_wallpaper() {
    echo 'setting swaybg wallpaper'
    swaybg -i ~/Public/wall/wall.png --mode fill &
}

function set_hyprpaper_wallpaper() {
    echo 'setting hyprpaper wallpaper'
    hyprpaper &
}

#top bar - ags
function run_ags() {
    echo 'running ags'
    ags &
}

#idle check
function run_swayidle() {
    echo 'running swayidle'
    ~/.config/scripts/swayidle.sh startup
}

function check_if_media_is_playing_and_stop_it() {
    echo 'checking if the media is playing'
    source ~/.config/scripts/playerstartup.sh
}

#clipboard
function run_copyq() {
    echo 'running copyq'
    env QT_QPA_PLATFORM=wayland copyq --start-server
}

#top bar - waybar
function run_waybar() {
    echo 'running waybar'
    waybar &
}

#notifications in top bar - waybar
function run_swaync() {
    echo 'running swaync'
    swaync &
}

#clipboard management, copyq
function run_clipboard() {
    echo 'running clipboard management - copyq'
    copyq --start-server
}

sleep_time() {
    sleep 0.2
}

# run_nightligh

# run_swayidle

# run_ags

# set_swaybg_wallpaper
# set_hyprpaper_wallpaper

# check_if_media_is_playing_and_stop_it

# run_copyq

# set_swaybg_wallpaper

# echo 'done'




# Function to start a program and wait for it to run
start_program() {
    local program=$1

    if pgrep $program; then
        echo "$program already running, before initialization"
        return 0
    fi

    if [[ -z $COMMAND ]]; then
        # Start the program
        echo "running: $program"
        $program > /dev/null 2>&1 &
    else
        # Start the script
        echo "running: $COMMAND"
        $COMMAND &
    fi

    # Main loop to retry for 10 seconds
    is_media_paused=
    end=$((SECONDS+5))
    while [ $SECONDS -lt $end ]; do
        if pgrep $program; then
            echo "$program already running"
            COMMAND=
            return 0
        fi

        sleep 0.5
    done

    echo "something failed"
    exit 1
}

# Start programs in order with a check
# start_program "xterm" "xterm -e journalctl -xef"

COMMAND=~/.config/scripts/nightlight.sh
start_program "wlsunset" ~/.config/scripts/nightlight.sh

COMMAND=~/.config/scripts/swayidle.sh
start_program "hypridle"

COMMAND=ags
start_program "ags"

if pgrep "ydotool"; then
    echo "$program already running, before initialization"
else
    sleep 2
fi

# env QT_QPA_PLATFORM=wayland copyq --start-server &
# echo "Copyq started"

sleep 1.2

source ~/.config/scripts/playerstartup.sh
