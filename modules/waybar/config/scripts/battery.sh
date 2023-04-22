#!/usr/bin/env bash

kbBat=$(upower -i $(upower -e | grep 'keyboard') | grep -E "percentage" | awk '{ if($2 != "" && $2 != "0%") print "⌨️ " $2;}')
mouseBat=$(upower -i $(upower -e | grep 'mouse') | grep -E "percentage" | awk '{ if($2 != "" && $2 != "0%") print "🖱 " $2;}')
#headsetBat=$(sudo headsetcontrol -b | grep 'Battery' | awk '{if($2 != "" && $2 != "0%") print "🎧 " $2;}')
headsetBat=''

echo "{\"text\":\"${kbBat} ${mouseBat} ${headsetBat}\", \"tooltip\":\"${kbBat} ${mouseBat} ${headsetBat}\"}"