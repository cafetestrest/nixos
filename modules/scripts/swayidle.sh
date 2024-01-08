#!/usr/bin/env bash

function run_swayidle {
    # swayidle timeout 300 'swaylock -F -i ~/.cache/wallpaper --effect-blur 10x5 --clock --indicator' timeout 600 'hyprctl dispatch dpms off' resume 'hyprctl dispatch dpms on' &
    # swayidle -w timeout 300 'exec ~/.config/scripts/idle.sh g' timeout 600 'exec ~/.config/scripts/idle.sh z' before-sleep 'gtklock -d' &
	swayidle -w timeout 600 'if pgrep swaylock; then exec ~/.config/scripts/idle.sh z; else exec ~/.config/scripts/idle.sh g; fi' \
	timeout 900 'if pgrep swaylock; then exec ~/.config/scripts/idle.sh z; else exec ~/.config/scripts/idle.sh g; fi' \
	after-resume 'hyprctl dispatch dpms on && exec ~/.config/scripts/wakefromsleep.sh' \
	before-sleep 'exec ~/.config/scripts/idle.sh l && hyprctl dispatch dpms off' & disown
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
