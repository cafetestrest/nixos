# https://blog.tcharles.fr/ddc-ci-screen-control-on-linux/

# Usage: ddc-setbrightness 50
# ddcutil --bus=0 setvcp 10 "$1" &
# ddcutil --bus=7 setvcp 10 "$1" &
# wait

cmd_usage() {
    echo "The following capabilities are available, please run the command like so:"
    echo "monitor (brightness | contrast | input_source | audio_speaker_volume | audio_mute) value"
    exit 1
}

get_bus() {
    # PROGRAM detect
    bus=$($PROGRAM detect | grep bus | awk -F'i2c-' '{print $2}')
}

capabilities() {
    # get list of monitor capabilities
    # $PROGRAM capabilities --bus=$BUS

    # manually updated for now
    brightness="10"
    contrast="12"
    # color_preset="14"
    # red="16"
    # green="18"
    # blue="1A"
    # active_control="52"
    # input_source="60"
    # power_mode="D6"
    audio_speaker_volume="62"
    audio_mute="8D"
}

cmd_brightness() {
    $PROGRAM --bus="$bus" setvcp $brightness "$1" &
    wait
    echo "changed brightness successfully to: $1"
    exit 0
}

cmd_contrast() {
    $PROGRAM --bus="$bus" setvcp $contrast "$1" &
    wait
    echo "changed contrast successfully to: $1"
    exit 0
}

# cmd_input_source() {
#     if [[ $1 == "hdmi1" || $1 == "1" || $1 == "11" ]]; then
#         input_val="11"
#     fi

#     if [[ $1 == "hdmi2" || $1 == "2" || $1 == "12"  ]]; then
#         input_val="12"
#     fi

#     if [[ $1 == "dp" || $1 == "3" || $1 == "15"  ]]; then
#         input_val="15"
#     fi

#     if [[ ! $input_val ]]; then
#         echo "Following input sources are available:"
#         echo "hdmi1, hdmi2, dp"
#         echo "command is valid like either one of:"
#         echo "monitor (input | source | input_source | input-source) (hdmi1 | hdmi2 | dp)"
#         exit 1
#     fi

#     $PROGRAM --bus="$bus" setvcp "$input_source" "$input_val" &
#     wait
#     echo "changed input source successfully to: $input_val ($1)"
#     exit 0
# }

# cmd_power_mode() {
#     if [[ $1 == "on" || $1 == "1" ]]; then
#         input_val="1"
#     fi

#     if [[ $1 == "off" || $1 == "0"|| $1 == "4" ]]; then
#         input_val="4"
#     fi

#     if [[ ! $input_val ]]; then
#         echo "Following power modes are available:"
#         echo "on, off"
#         echo "command is valid like either one of:"
#         echo "monitor (power | powermode | power-mode | power_mode) (on | off)"
#         exit 1
#     fi

#     $PROGRAM --bus="$bus" setvcp "$power_mode" "$input_val" &
#     wait
#     echo "changed power mode successfully to: $input_val ($1)"
#     exit 0
# }

cmd_volume() {
    $PROGRAM --bus="$bus" setvcp $audio_speaker_volume "$1" &
    wait
    echo "changed audio speaker volume successfully to: $1"
    exit 0
}

cmd_mute() {
    if [[ $1 == "on" || $1 == "1" ]]; then
        input_val="1"
    fi

    if [[ $1 == "off" || $1 == "2" ]]; then
        input_val="2"
    fi

    if [[ ! $input_val ]]; then
        input_val="2"
    fi

    $PROGRAM --bus="$bus" setvcp $audio_mute "$input_val" &
    wait
    echo "changed audio mute successfully to: $1"
    exit 0
}

PROGRAM=ddcutil

get_bus

if [[ ! "$bus" ]]; then
    echo "No bus found, please update get_bus function currently it is: ddcutil detect | grep bus | awk -F'i2c-' '{print \$2}'."
    exit 1
fi

capabilities

if [[ $# -le 1 ]]; then
    cmd_usage "$@"
fi

case "$1" in
    brightness|--brightness) shift;                         cmd_brightness "$@" ;;
    contrast|--contrast) shift;                             cmd_contrast "$@" ;;
    # source|--source) shift;                                 cmd_input_source "$@" ;;
    # input|--input) shift;                                   cmd_input_source "$@" ;;
    # input-source|--input-source) shift;                     cmd_input_source "$@" ;;
    # input_source|--input_source) shift;                     cmd_input_source "$@" ;;
    # power|--power) shift;                                   cmd_power_mode "$@" ;;
    # powermode|--powermode) shift;                           cmd_power_mode "$@" ;;
    # power-mode|--power-mode) shift;                         cmd_power_mode "$@" ;;
    # power_mode|--power_mode) shift;                         cmd_power_mode "$@" ;;
    audio|--audio) shift;                                   cmd_volume "$@" ;;
    speaker|--speaker) shift;                               cmd_volume "$@" ;;
    volume|--volume) shift;                                 cmd_volume "$@" ;;
    audio_speaker_volume|--audio_speaker_volume) shift;     cmd_volume "$@" ;;
    mute|--mute) shift;                                     cmd_mute "$@" ;;
    audio_mute|--audio_mute) shift;                         cmd_mute "$@" ;;
    help|--help) shift;                                     cmd_usage "$@" ;;
    *)                     echo "Unknown command: " "$@" && cmd_usage "$@" ;;
esac

cmd_usage
