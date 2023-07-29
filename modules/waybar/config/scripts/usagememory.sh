#!/usr/bin/env bash

usage=$(free --giga -h | grep 'Mem' | awk '{print $3}')

firstArg="$(echo "$1")"

if [[ $firstArg == "ags" ]]; then
    ags run-js "ags.Service.Usage.setMemoryUsage('$usage')"
else
    echo ${usage}
fi
