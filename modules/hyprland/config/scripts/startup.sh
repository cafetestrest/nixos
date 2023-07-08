#!/usr/bin/env bash

function open_apps() {
    hyprctl dispatch exec "[workspace 1]" chromium
    hyprctl dispatch exec "[workspace 1]" "terminator --working-directory ~/nixos"

    sleep 1

    hyprctl dispatch movefocus r
    hyprctl dispatch exec "[workspace 1]" "codium ~/nixos/"

    sleep 0.7

    hyprctl dispatch swapnext
}

open_apps