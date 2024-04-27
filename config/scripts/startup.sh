#!/usr/bin/env bash

#night light
function run_wlsunset() {
    echo 'running wlsunset'
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
    AGS_SKIP_V_CHECK=true ags -b hypr &
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

# run_wlsunset

# run_swayidle

# run_ags

# set_swaybg_wallpaper
# set_hyprpaper_wallpaper

# check_if_media_is_playing_and_stop_it

# run_copyq

set_swaybg_wallpaper

# echo 'done'
