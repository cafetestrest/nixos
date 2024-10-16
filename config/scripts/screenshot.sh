screenshot() {
    ssDir=~/Pictures/Screenshots

    if [ ! -d $ssDir ]; then
        mkdir -p $ssDir
    fi

    if [ "$#" -eq  "0" ]
    then
        # IMG=$ssDir/$(date +'Screenshot_%Y-%m-%d_%H-%M-%S.png') && grim "$IMG" && notify-send "Screenshot" "Saved and Copied";
        hyprshot -m output --current --output-folder "$ssDir"
    else
        firstArgLetter="$(echo "$1" | head -c 1)"

        if [[ $firstArgLetter == "2" || $firstArgLetter == "w" ]]; then
            hyprshot -m window --output-folder "$ssDir"
        else
            # IMG=$ssDir/$(date +'Screenshot_%Y-%m-%d_%H-%M-%S.png') && grim -g "$(slurp -c cba6f788 -b 00000055 -w 0)" "$IMG" && notify-send "Screenshot" "Saved and Copied";
            hyprshot -m region --output-folder "$ssDir"
        fi
    fi
}

if [[ $# -eq 0 ]] ; then
    screenshot
    exit 0
fi

case "$1" in
    screenshot|--screenshot) shift;     screenshot ;;
    ss|--ss) shift;                     screenshot ;;
    region|--region) shift;             screenshot 1 ;;
    r|--r) shift;                       screenshot 1 ;;
    1|--1) shift;                       screenshot 1 ;;
    window|--window) shift;             screenshot 2 ;;
    w|--w) shift;                       screenshot 2 ;;
    2|--2) shift;                       screenshot 2 ;;
    *)                                  screenshot "$@" ;;
esac
exit 0
