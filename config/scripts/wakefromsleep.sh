
# RUN_REFRESH_BT=1
RUN_NIGHTLIGHT=1
RUN_WEATHER=1

if [[ $# -eq 0 ]] ; then
  # RUN_REFRESH_BT=0
  RUN_NIGHTLIGHT=0
  RUN_WEATHER=0
else
  while (( "$#" )); do
    case "$1" in
      ags|a|--ags|--a)
        shift;
        # RUN_REFRESH_BT=0
        RUN_WEATHER=0
        ;;
      # bluetooth|bt|b|--bluetooth|--bt|--b)
      #   shift;
      #   RUN_REFRESH_BT=0
      #   ;;
      nightlight|nl|wlsunset|n|--nightlight|--nl|--wlsunset|--n)
        shift;
        RUN_NIGHTLIGHT=0
        ;;
      weather|w|--weather|--w)
        shift;
        RUN_WEATHER=0
        ;;
      *)
        echo "Unknown command: " "$@"
        exit 1
        ;;
    esac
  done
fi

# function refresh_ags_bluetooth_connected_devices() {
#   if [[ "$RUN_REFRESH_BT" == "0" ]]; then
#     if pgrep ags; then
#       ags -r "$(cat "$HOME"/.config/scripts/resetbluetoothags.js)"
#       RUN_REFRESH_BT=1
#     fi
#   fi
# }

function refresh_ags_weather_info() {
  if [[ "$RUN_WEATHER" == "0" ]]; then
    if pgrep ags; then
      openweathermap ags
      RUN_WEATHER=1
    fi
  fi
}

function refresh_nightlight() {
  if [[ "$RUN_NIGHTLIGHT" == "0" ]]; then
    if pgrep wlsunset; then
      nightlight a
      RUN_NIGHTLIGHT=1
    fi
  fi
}

# check if the PC is unlocked - gtklock not running for max duration defined below
max_duration=15     # Maximum duration to check - seconds
interval=5          # Interval between checks
elapsed=0           # Elapsed time counter

sleep $interval

while [ "$elapsed" -lt "$max_duration" ]; do
  if ! pgrep hyprlock; then
    # commands to run if unlocked
    refresh_ags_weather_info

    refresh_nightlight

    # refresh_ags_bluetooth_connected_devices
    break
  fi

  sleep $interval
  elapsed=$(bc <<< "$elapsed + $interval")
done

# echo 'done'
exit 0
