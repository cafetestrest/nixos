#!/usr/bin/env bash

#night light
function run_wlsunset() {
    echo 'running wlsunset'
    nohup wlsunset -t 3500 -l 39.07 -L 21.82 > /dev/null 2>&1 &
}

function set_swaybg_wallpaper() {
    echo 'setting wallpaper'
    swaybg -i ~/Public/wall/wall.png --mode fill &
}

#top bar - ags
function run_ags() {
    echo 'running ags'
    ags &
}

#idle check
function run_swayidle() {
    echo 'running swayidle'
    # swayidle -w timeout 300 'gtklock -d' timeout 600 'exec systemctl suspend' before-sleep  'gtklock -d'
    swayidle -w timeout 300 'exec ~/.config/scripts/idle.sh' timeout 600 'exec ~/.config/scripts/idle.sh' before-sleep 'gtklock -d' &
}

function check_if_media_is_playing_and_stop_it() {
    echo 'checking if the media is playing'
    source ~/.config/scripts/playerstartup.sh
}

#clipboard
function run_copyq() {
    echo 'running copyq'
    copyq --start-server
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

run_wlsunset

set_swaybg_wallpaper

run_swayidle

# run_ags

check_if_media_is_playing_and_stop_it

run_copyq

echo 'done'