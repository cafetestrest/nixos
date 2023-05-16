#!/usr/bin/env bash
#https://github.com/Madic-/Sway-DE/blob/master/bin/dmenupower.sh

# case $(echo -e '⏾ Suspend\n Reboot\n⏻ Shutdown' | rofi -dmenu -config ~/.config/rofi/spotlight-hidden-search.rasi | awk '{print tolower($2)}') in
#     suspend)
#         exec systemctl suspend;;
#     reboot)
#         exec systemctl reboot;;
#     shutdown)
#     exec systemctl poweroff -i;;
# esac

#https://github.com/lauroro/hyprland-dotfiles/blob/master/.config/rofi/powermenu.sh

if pidof rofi; then
    killall -9 rofi;
fi

lock=" Lock"
logout=" Logout"
shutdown=" Shutdown"
reboot=" Reboot"
sleep=" Sleep"
 
selected_option=$(echo "$sleep
$logout
$reboot
$shutdown" | rofi -dmenu -i -p "Powermenu" \
		  -theme "~/.config/rofi/spotlight-hidden-search.rasi")

if [ "$selected_option" == "$lock" ]
then
  swaylock
elif [ "$selected_option" == "$logout" ]
then
  loginctl terminate-user `whoami`
elif [ "$selected_option" == "$shutdown" ]
then
  # loginctl poweroff
  exec systemctl poweroff -i
elif [ "$selected_option" == "$reboot" ]
then
  # loginctl reboot
  exec systemctl reboot
elif [ "$selected_option" == "$sleep" ]
then
  # loginctl suspend
  exec systemctl suspend
else
  echo "No match"
fi
