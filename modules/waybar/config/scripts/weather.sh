#!/usr/bin/env bash

for i in {1..5}
do
    #text=$(curl -s "https://wttr.in/$1?format=1")
    text=$(curl -s curl "wttr.in/$1?format="%C+%c%t+%p"")
    if [[ $? == 0 ]]
    then
        text=$(echo "$text" | sed -E "s/\s+/ /g")
        tooltip=$(curl -s "https://wttr.in/$1?format=4")
        if [[ $? == 0 ]]
        then
            tooltip=$(echo "$tooltip" | sed -E "s/\s+/ /g")
            echo "{\"text\":\"$text\", \"tooltip\":\"$tooltip\"}"
            exit
        fi
    fi
    sleep 2
done
echo "{\"text\":\"\", \"tooltip\":\"Failed to retrieve weather information.\"}"