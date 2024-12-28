headsetStatus=$(wpctl status | grep "SteelSeries Arctis 7 Game" || true);
headsetId=""
if [[ -n "$headsetStatus" ]]; then
    headsetId=$(echo "$headsetStatus" | grep -Po "\d+" | head -n 1)
fi

if [[ -n "$headsetId" ]]; then
    hasStar=$(echo "$headsetStatus" | grep '\*' || true)

    if [[ -n "$hasStar" ]]; then
        headsetId=""
    fi
fi

headphonesStatus=$(wpctl status | grep "Realtek USB2.0 Audio Analog Stereo" || true);
headphonesId=""
if [[ -n "$headphonesStatus" ]]; then
    headphonesId=$(echo "$headphonesStatus" | grep -Po "\d+" | head -n 1)
fi

if [[ -n "$headphonesId" ]]; then
    hasStar=$(echo "$headphonesStatus" | grep '\*' || true)

    if [[ -n "$hasStar" ]]; then
        headphonesId=""
    fi
fi

if [[ -n "$headphonesId" ]]; then
    wpctl set-default "$headphonesId"
    notify-send "Audio Output changed to Headphones"
else
    if [[ -n "$headsetId" ]]; then
        wpctl set-default "$headsetId"
        notify-send "Audio Output changed to Headset"
    else
        notify-send "No device found"
    fi
fi
