#!/usr/bin/env bash

programPid=$(pgrep wlsunset);

if [ -z "$programPid" ]; then
    icon="󰹐";
    tooltip="Disabled Night Light.";
    class="Paused";
else
    icon="󱩍";
    tooltip="Enabled Auto Night Light, turning it on 19:00 untill 07:00.";
    class="Playing";
fi

echo "{\"text\": \"\", \"tooltip\":\"${tooltip}\", \"alt\": \"${class}\", \"class\":\"${class}\"}"
