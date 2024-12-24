skipRunningStartupApps=0

#checks the first letter of the argument provided to the script
if [[ $# -ge 1 ]]; then
    firstArgLetter="$(echo "$1" | head -c 1)"
else
    firstArgLetter=
fi

if [[ $firstArgLetter == "s" ]]; then
    skipRunningStartupApps=1
fi

# Function to start a program and wait for it to run
start_program() {
    local program=$1

    if pgrep "$program"; then
        echo "$program already running, before initialization"
        return 0
    fi

    if [[ -z $COMMAND ]]; then
        # Start the program
        echo "running: $program"
        $program > /dev/null 2>&1 &
    else
        # Start the script
        echo "running: $COMMAND"
        $COMMAND &
    fi

    # Main loop to retry for 10 seconds
    end=$((SECONDS+5))
    while [ $SECONDS -lt $end ]; do
        if pgrep "$program"; then
            echo "$program already running"
            COMMAND=
            return 0
        fi

        sleep 0.5
    done

    echo "something failed"
    exit 1
}

# Start programs in order with a check
# start_program "xterm" "xterm -e journalctl -xef"

sleep 0.3

if [ "$skipRunningStartupApps" = "0" ]; then
    openstartupapps
fi

COMMAND="nightlight a > /dev/null 2>&1"
start_program "wlsunset"

COMMAND="toggleidle a"
start_program "hypridle"

COMMAND="ags run"
start_program "ags"

if pgrep "ydotool"; then
    echo "ydotool already running, before initialization"
fi

# env QT_QPA_PLATFORM=wayland copyq --start-server &
# echo "Copyq started"
