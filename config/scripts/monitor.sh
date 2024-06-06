#!/usr/bin/env bash

# https://blog.tcharles.fr/ddc-ci-screen-control-on-linux/

# Usage: ddc-setbrightness 50
# ddcutil --bus=0 setvcp 10 "$1" &
# ddcutil --bus=7 setvcp 10 "$1" &
# wait

help_usage() {
    echo "The following capabilities are available, please run the command like so:"
    echo "monitor.sh (brightness | contrast | input_source | audio_speaker_volume | audio_mute) value"
    exit 1
}

get_bus() {
    # ddcutil detect
    bus=$(ddcutil detect | grep bus | awk -F'i2c-' '{print $2}')
}

capabilities() {
    # get list of monitor capabilities
    # ddcutil capabilities --bus=$BUS

    # manually updated for now
    brightness="10"
    contrast="12"
    # color_preset="14"
    # red="16"
    # green="18"
    # blue="1A"
    # active_control="52"
    input_source="60"
    # power_mode="D6"
    audio_speaker_volume="62"
    audio_mute="8D"
}

get_bus

if [[ ! "$bus" ]]; then
    echo "No bus found, please update get_bus function currently it is: ddcutil detect | grep bus | awk -F'i2c-' '{print \$2}'."
    exit 1
fi

capabilities

if [[ $# -le 1 ]]; then
    help_usage
fi

if [[ $(echo "$1" | sed 's/^--*//') == "brightness" ]]; then
    ddcutil --bus=$bus setvcp $brightness "$2" &
    wait
    echo "changed brightness successfully to: $2"
fi

if [[ $(echo "$1" | sed 's/^--*//') == "contrast" ]]; then
    ddcutil --bus=$bus setvcp $contrast "$2" &
    wait
    echo "changed contrast successfully to: $2"
fi

input_source_logic() {
    if [[ $2 == "hdmi1" || $2 == "1" ]]; then
        input_val="11"
    fi

    if [[ $2 == "hdmi2" || $2 == "2" ]]; then
        input_val="12"
    fi

    if [[ $2 == "dp" || $2 == "3" ]]; then
        input_val="0f"
    fi

    if [[ ! $input_val ]]; then
        echo "Following input sources are available:"
        echo "hdmi1, hdmi2, dp"
        echo "command is valid like either one of:"
        echo "monitor.sh (input | source | input_source | input-source) (hdmi1 | hdmi2 | dp)"
        exit 1
    fi

    ddcutil --bus=$bus setvcp $input_source $input_val &
    wait
    echo "changed input source successfully to: $input_val ($2)"
}

if [[ $(echo "$1" | sed 's/^--*//') == "source" || $(echo "$1" | sed 's/^--*//') == "input" ]]; then
    input_source_logic $1 $2
fi

if [[ $(echo "$1" | sed 's/^--*//') == "input-source" || $(echo "$1" | sed 's/^--*//') == "input_source" ]]; then
    input_source_logic $1 $2
fi

power_mode_logic() {
    if [[ $2 == "on" ]]; then
        input_val="01"
    fi

    if [[ $2 == "off" ]]; then
        input_val="04"
    fi

    if [[ ! $input_val ]]; then
        echo "Following power modes are available:"
        echo "on, off"
        echo "command is valid like either one of:"
        echo "monitor.sh (power | powermode | power-mode | power_mode) (on | off)"
        exit 1
    fi

    ddcutil --bus=$bus setvcp $power_mode $input_val &
    wait
    echo "changed power mode successfully to: $input_val ($2)"
}

# if [[ $(echo "$1" | sed 's/^--*//') == "power" || $(echo "$1" | sed 's/^--*//') == "powermode" ]]; then
#     power_mode_logic $1 $2
# fi

# if [[ $(echo "$1" | sed 's/^--*//') == "power-mode" || $(echo "$1" | sed 's/^--*//') == "power_mode" ]]; then
#     power_mode_logic $1 $2
# fi

audio_speaker_volume_logic() {
    ddcutil --bus=$bus setvcp $audio_speaker_volume "$2" &
    wait
    echo "changed audio speaker volume successfully to: $2"
}

if [[ $(echo "$1" | sed 's/^--*//') == "audio" || $(echo "$1" | sed 's/^--*//') == "speaker" ]]; then
    audio_speaker_volume_logic $1 $2
fi

if [[ $(echo "$1" | sed 's/^--*//') == "volume" || $(echo "$1" | sed 's/^--*//') == "audio_speaker_volume" ]]; then
    audio_speaker_volume_logic $1 $2
fi

if [[ $(echo "$1" | sed 's/^--*//') == "mute" || $(echo "$1" | sed 's/^--*//') == "audio_mute" ]]; then
    if [[ $2 == "on" || $2 == "1" ]]; then
        input_val="1"
    fi

    if [[ $2 == "off" || $2 == "2" ]]; then
        input_val="2"
    fi

    if [[ ! $input_val ]]; then
        input_val="2"
    fi

    ddcutil --bus=$bus setvcp $audio_mute $input_val &
    wait
    echo "changed audio mute successfully to: $2"
fi
