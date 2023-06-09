#!/usr/bin/env bash

sinkNames=$(wpctl status | awk '/^ ├─ Sources:/,/^ ├─ Source endpoints:/ {if (NR>2) print}' | grep -E '*[0-9]+\.'| sed 's/\[.*//' | sed 's/.*[0-9]\+\.\s*//' | rofi -dmenu -i -p "Select Microphone Output");

if [ ! -z "$sinkNames" ]; then
    sinkNumber=$(wpctl status | awk '/^ ├─ Sources:/,/^ ├─ Source endpoints:/ {if (NR>2) print}' | grep "${sinkNames}" | grep -E '*[0-9]+\.' | awk '{ for(i=1; i<=NF; i++) { if($i ~ /^[0-9]+\.$/) { print $i; break; } } }' | sed 's/\.$//');

    if [ ! -z "$sinkNumber" ]; then
        wpctl set-default $sinkNumber
    fi
fi
