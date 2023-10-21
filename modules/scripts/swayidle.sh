#!/usr/bin/env bash

function run_swayidle {
    # swayidle timeout 300 'swaylock -F -i ~/.cache/wallpaper --effect-blur 10x5 --clock --indicator' timeout 600 'hyprctl dispatch dpms off' resume 'hyprctl dispatch dpms on' &
    # swayidle -w timeout 300 'exec ~/.config/scripts/idle.sh g' timeout 600 'exec ~/.config/scripts/idle.sh z' before-sleep 'gtklock -d' &
	swayidle -w timeout 600 'exec ~/.config/scripts/idle.sh g' timeout 900 'exec ~/.config/scripts/idle.sh z' after-resume 'hyprctl dispatch dpms on' before-sleep 'exec ~/.config/scripts/idle.sh l && hyprctl dispatch dpms off' & disown
}

function toggle {
	if pgrep "swayidle" > /dev/null
	then
		pkill swayidle
		# notify-send -r 5556 -u normal "  Swayidle Inactive"
	else
        run_swayidle
		# notify-send -r 5556 -u normal "  Swayidle Active"
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
