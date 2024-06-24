#!/usr/bin/env bash

firstArgLetter="$(echo "$1" | head -c 1)"

function terminal() {
  # PS3="Select an option (enter the number): "; options=("Lock" "Sleep" "Logout" "Reboot" "Shutdown" "Exit"); select option in "${options[@]}"; do case $REPLY in 1) echo "Locking..."; ~/.config/scripts/idle.sh l;; 2) echo "Going to sleep..."; ~/.config/scripts/idle.sh s;; 3) echo "Logout..."; loginctl terminate-user "$(whoami)";; 4) echo "Restarting the system..."; exec systemctl reboot;; 5) echo "Shutting down the system..."; exec systemctl poweroff -i;; 6) echo "Exiting the power menu."; exit 0;; *) echo "Invalid option. Please select a valid option.";; esac; done

  PS3="Select an option (enter the number): "
  options=("Lock" "Sleep" "Logout" "Reboot" "Shutdown" "Exit")

  select option in "${options[@]}"
  do
      case $REPLY in
          1)
              echo "Locking..."
              ~/.config/scripts/idle.sh l
              ;;
          2)
              echo "Going to sleep..."
              ~/.config/scripts/idle.sh s
              ;;
          3)
              echo "Logout..."
              loginctl terminate-user "$(whoami)"
              ;;
          4)
              echo "Restarting the system..."
              exec systemctl reboot
              ;;
          5)
              echo "Shutting down the system..."
              exec systemctl poweroff -i
              ;;
          6)
              echo "Exiting the power menu."
              exit 0
              ;;
          *)
              echo "Invalid option: $option. Please select a valid option."
              ;;
      esac
  done
}

if [[ $firstArgLetter == "t" ]]; then
    terminal
    exit 0
fi

if pidof rofi; then
    killall -9 rofi;
fi

lock="   Lock"
logout="   Logout"
shutdown="   Shutdown"
reboot="   Reboot"
sleep="   Sleep"
 
selected_option=$(echo "$lock
$sleep
$logout
$reboot
$shutdown" | rofi -dmenu -i -p "Powermenu" \
		  -theme "$HOME/.config/rofi/spotlight-hidden-search.rasi")

if [ "$selected_option" == "$lock" ]
then
  ~/.config/scripts/idle.sh l
elif [ "$selected_option" == "$logout" ]
then
  loginctl terminate-user "$(whoami)"
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
  ~/.config/scripts/idle.sh s
else
  echo "No match"
fi
