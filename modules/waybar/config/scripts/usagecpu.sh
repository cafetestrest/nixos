#!/usr/bin/env bash

usage=$(top -bn1 | grep "Cpu(s)" | \
           sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | \
           awk '{print 100 - $1"%"}')

firstArg="$(echo "$1")"

if [[ $firstArg == "ags" ]]; then
    ags run-js "usage.setCpuUsage('${usage}')"
else
    echo ${usage}
fi
