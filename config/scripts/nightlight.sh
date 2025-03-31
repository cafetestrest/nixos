disable() {
    if pidof wlsunset; then
        killall -9 wlsunset
    fi
}

enable() {
    disable
    wlsunset -t "$nightLightTemp" -S 06:00 -s 06:00 &
}

automatic() {
    disable
    nohup wlsunset -t "$nightLightTemp" -l 39.07 -L 21.82 &
}

automatic_winter() {
    # echo "Winter time"
    disable
    nohup wlsunset -t "$nightLightTemp" -l 44.81 -L 23.46 > /dev/null 2>&1 &
}

toggle() {
    if pidof wlsunset; then
        disable
    else
        enable
    fi
}

manual() {
    disable

    wlsunset -t "$1" -T "$2" -S "$3" -s "$4" -d "$5" &
}

monthlyAuto() {
    # Get the current month in two-digit format (01 for January, 02 for February, etc.)
    current_month=$(date +'%m')

    # Display the current month
    # echo "Current Month: $current_month"

    # Case statement to perform actions based on the current month
    case $current_month in
        12|01|02) automatic_winter;;
        *) automatic;;
    esac
}

monthlyManual() {
    current_month=$(date +'%m')

    if [[ "$current_month" == "03" || "$current_month" == "10" ]]; then
        current_day=$(date +'%d')
        current_year=$(date +'%Y')

        # Get the last Sunday of March (DST start) and last Sunday of October (DST end)
        last_sunday_march=$(date -d "$current_year-03-31 -$(date -d "$current_year-03-31" +%u) days" +%d)
        last_sunday_october=$(date -d "$current_year-10-31 -$(date -d "$current_year-10-31" +%u) days" +%d)

        # If between March last Sunday and end of March, treat as April
        if [[ "$current_month" == "03" && "$current_day" -ge "$last_sunday_march" ]]; then
            current_month="04"
        fi

        # If between October last Sunday and end of October, treat as November
        if [[ "$current_month" == "10" && "$current_day" -ge "$last_sunday_october" ]]; then
            current_month="11"
        fi
    fi

    case $current_month in
        01) manual 2700 6500 07:50 16:00 1800;;
        02) manual 2700 6500 07:20 16:20 1800;;
        03) manual 2700 6500 06:50 17:30 1800;;
        04) manual 2700 6500 06:20 19:00 1800;;
        05) manual 2700 6500 05:50 19:30 1800;;
        06|07) manual 2700 6500 05:30 20:00 1800;;
        08) manual 2700 6500 05:50 19:30 1800;;
        09) manual 2700 6500 06:20 18:30 1800;;
        10) manual 2700 6500 06:50 17:30 1800;;
        11) manual 2700 6500 07:20 16:00 1800;;
        12) manual 2700 6500 07:40 15:30 1800;;
        *) automatic;;
    esac
}

#checks the first letter of the argument provided to the script
if [[ $# -ge 1 ]]; then
    firstArgLetter="$(echo "$1" | head -c 1)"
else
    firstArgLetter=
fi

if [[ $# -ge 2 ]]; then
    nightLightTemp="$2"
else
    nightLightTemp=2700
fi

if [ -z "$firstArgLetter" ]; then
    # monthlyAuto
    monthlyManual
else
    if [[ "$firstArgLetter" == "d" ]]; then
        disable
    elif [[ "$firstArgLetter" == "e" ]]; then
        enable
    elif [[ "$firstArgLetter" == "t" ]]; then
        toggle
    elif [[ "$firstArgLetter" == "m" ]]; then
        monthlyAuto
    elif [[ "$firstArgLetter" == "a" ]]; then
        monthlyManual
    else
        monthlyManual
    fi
fi
