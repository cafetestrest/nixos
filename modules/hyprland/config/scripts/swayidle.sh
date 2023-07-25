#!/usr/bin/env bash

function run_swayidle {
    # swayidle timeout 300 'swaylock -F -i ~/.cache/wallpaper --effect-blur 10x5 --clock --indicator' timeout 600 'hyprctl dispatch dpms off' resume 'hyprctl dispatch dpms on' &
    swayidle -w timeout 300 'exec ~/.config/hypr/scripts/idle.sh' timeout 600 'exec ~/.config/hypr/scripts/idle.sh' before-sleep  'gtklock -d'
}

function toggle {
	if pgrep "swayidle" > /dev/null
	then
		pkill swayidle
		notify-desktop -r 5556 -u normal "  Swayidle Inactive"
	else
        run_swayidle &
		notify-desktop -r 5556 -u normal "  Swayidle Active"
	fi
}

case $1 in
	toggle)
		toggle
		;;
	startup)
		run_swayidle
		;;
	*)
		if pgrep "swayidle" > /dev/null
		then
			icon=""
		else
			icon=""
		fi
		printf "%s" "$icon "
		;;
esac
