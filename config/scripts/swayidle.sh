#!/usr/bin/env bash

function run_swayidle {
	# swayidle -w timeout 600 'if pgrep swaylock; then exec idle z; else exec idle g; fi' \
	# timeout 900 'if pgrep swaylock; then exec idle z; else exec idle g; fi' \
	# after-resume 'hyprctl dispatch dpms on && exec wakefromsleep' \
	# before-sleep 'exec idle l && hyprctl dispatch dpms off' & disown

	hypridle & disown
}

function toggle {
	if pgrep "hypridle" > /dev/null
	then
		pkill hypridle
		# notify-send -r 5556 -u normal "  Swayidle Inactive"
	else
        run_swayidle
		# notify-send -r 5556 -u normal "  Swayidle Active"
	fi
}

# case $1 in
# 	toggle)
# 		toggle
# 		;;
# 	startup)
# 		run_swayidle
# 		;;
# 	*)
# 		if pgrep "swayidle" > /dev/null
# 		then
# 			icon=""
# 		else
# 			icon=""
# 		fi
# 		printf "%s" "$icon "
# 		;;
# esac

#checks the first letter of the argument provided to the script
if [[ $# -ge 1 ]]; then
    firstArgLetter="$(echo "$1" | head -c 1)"
else
    firstArgLetter=
fi

if [ -z "$firstArgLetter" ]; then
    run_swayidle
else
    if [[ "$firstArgLetter" == "t" ]]; then
        toggle
    else
        run_swayidle
    fi
fi

