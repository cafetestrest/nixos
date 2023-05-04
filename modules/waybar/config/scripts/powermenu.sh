#!/usr/bin/env bash
#https://github.com/Madic-/Sway-DE/blob/master/bin/dmenupower.sh

case $(echo -e '⏾ Suspend\n Reboot\n⏻ Shutdown' | rofi -dmenu -config ~/.config/rofi/spotlight-hidden-search.rasi | awk '{print tolower($2)}') in
    suspend)
        exec systemctl suspend;;
    reboot)
        exec systemctl reboot;;
    shutdown)
    exec systemctl poweroff -i;;
esac
