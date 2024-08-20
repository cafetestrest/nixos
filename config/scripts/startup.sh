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

COMMAND="nightlight a > /dev/null 2>&1"
start_program "wlsunset"

COMMAND="toggleidle a"
start_program "hypridle"

COMMAND=ags
start_program "ags"

if pgrep "ydotool"; then
    echo "ydotool already running, before initialization"
else
    sleep 2
fi

# env QT_QPA_PLATFORM=wayland copyq --start-server &
# echo "Copyq started"

sleep 2

openstartupapps
