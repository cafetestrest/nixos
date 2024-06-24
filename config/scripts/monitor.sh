#!/usr/bin/env bash

# https://blog.tcharles.fr/ddc-ci-screen-control-on-linux/

# Usage: ddc-setbrightness 50
# ddcutil --bus=0 setvcp 10 "$1" &
# ddcutil --bus=7 setvcp 10 "$1" &
# wait

success=

help_usage() {
    echo "The following capabilities are available, please run the command like so:"
    echo "monitor (brightness | contrast | input_source | audio_speaker_volume | audio_mute) value"
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

if [[ "${1##--}" == "brightness" ]]; then
    ddcutil --bus="$bus" setvcp $brightness "$2" &
    wait
    echo "changed brightness successfully to: $2"
    success=1
fi

if [[ "${1##--}" == "contrast" ]]; then
    ddcutil --bus="$bus" setvcp $contrast "$2" &
    wait
    echo "changed contrast successfully to: $2"
    success=1
fi

input_source_logic() {
    if [[ $2 == "hdmi1" || $2 == "1" || $2 == "11" ]]; then
        input_val="11"
    fi

    if [[ $2 == "hdmi2" || $2 == "2" || $2 == "12"  ]]; then
        input_val="12"
    fi

    if [[ $2 == "dp" || $2 == "3" || $2 == "15"  ]]; then
        input_val="15"
    fi

    if [[ ! $input_val ]]; then
        echo "Following input sources are available:"
        echo "hdmi1, hdmi2, dp"
        echo "command is valid like either one of:"
        echo "monitor (input | source | input_source | input-source) (hdmi1 | hdmi2 | dp)"
        exit 1
    fi

    ddcutil --bus="$bus" setvcp "$input_source" "$input_val" &
    wait
    echo "changed input source successfully to: $input_val ($2)"
    success=1
}

if [[ "${1##--}" == "source" || "${1##--}" == "input" ]]; then
    input_source_logic "$1" "$2"
fi

if [[ "${1##--}" == "input-source" || "${1##--}" == "input_source" ]]; then
    input_source_logic "$1" "$2"
fi

# power_mode_logic() {
#     if [[ $2 == "on" || $2 == "1" ]]; then
#         input_val="1"
#     fi

#     if [[ $2 == "off" || $2 == "0"|| $2 == "4" ]]; then
#         input_val="4"
#     fi

#     if [[ ! $input_val ]]; then
#         echo "Following power modes are available:"
#         echo "on, off"
#         echo "command is valid like either one of:"
#         echo "monitor (power | powermode | power-mode | power_mode) (on | off)"
#         exit 1
#     fi

#     ddcutil --bus="$bus" setvcp "$power_mode" "$input_val" &
#     wait
#     echo "changed power mode successfully to: $input_val ($2)"
#     success=1
# }

# if [[ $(echo "$1" | sed 's/^--*//') == "power" || $(echo "$1" | sed 's/^--*//') == "powermode" ]]; then
#     power_mode_logic $1 $2
# fi

# if [[ $(echo "$1" | sed 's/^--*//') == "power-mode" || $(echo "$1" | sed 's/^--*//') == "power_mode" ]]; then
#     power_mode_logic $1 $2
# fi

audio_speaker_volume_logic() {
    ddcutil --bus="$bus" setvcp $audio_speaker_volume "$2" &
    wait
    echo "changed audio speaker volume successfully to: $2"
    success=1
}

if [[ "${1##--}" == "audio" || "${1##--}" == "speaker" ]]; then
    audio_speaker_volume_logic "$1" "$2"
fi

if [[ "${1##--}" == "volume" || "${1##--}" == "audio_speaker_volume" ]]; then
    audio_speaker_volume_logic "$1" "$2"
fi

if [[ "${1##--}" == "mute" || "${1##--}" == "audio_mute" ]]; then
    if [[ $2 == "on" || $2 == "1" ]]; then
        input_val="1"
    fi

    if [[ $2 == "off" || $2 == "2" ]]; then
        input_val="2"
    fi

    if [[ ! $input_val ]]; then
        input_val="2"
    fi

    ddcutil --bus="$bus" setvcp $audio_mute "$input_val" &
    wait
    echo "changed audio mute successfully to: $2"
    success=1
fi

if [[ ! $success ]]; then
    help_usage
fi
