#!/usr/bin/env bash

kbBat=$(upower -i $(upower -e | grep 'keyboard') | grep -E "percentage" | awk '{ if($2 != "" && $2 != "0%") print $2;}')
mouseBat=$(upower -i $(upower -e | grep 'mouse') | grep -E "percentage" | awk '{ if($2 != "" && $2 != "0%") print $2;}')
#headsetBat=$(sudo headsetcontrol -b | grep 'Battery' | awk '{if($2 != "" && $2 != "0%") print $2;}')

#default colors in bar
normalColor='#ffffff'
colorLow="#e40613"
colorMedium="#f9e2af"

#1st param = bat level, 2nd param = <= 10% colorLow, 3rd param = colorMedium > 10% & <= 20%, 4th param = > 20% normalColor, 5th param icon before bat level %
setBatteryParams() {
    if [ ! -z $1 ]; then
        #remove % sign
        batLvlPerc=$1
        batLevel=$(echo ${batLvlPerc:0:-1})

        #set colors upon battery level
        if [ $batLevel -gt 20 ]; then
            batColor=$4;
        fi

        if [ $batLevel -lt 21 ]; then
            batColor=$3;
        fi

        if [ $batLevel -lt 11 ]; then
            batColor=$2;
        fi

        echo " <span color='$batColor'><b>$5${batLvlPerc}</b></span>"
    fi
}

mb=$(setBatteryParams "$mouseBat" $colorLow $colorMedium $normalColor "🖱 ")
kb=$(setBatteryParams "$kbBat" $colorLow $colorMedium $normalColor "⌨️ ")
hb=$(setBatteryParams "$headsetBat" $colorLow $colorMedium $normalColor "🎧 ")

echo "{\"text\":\"$mb$kb$hb\", \"tooltip\":\"$mb\r$kb\r$hb\"}"