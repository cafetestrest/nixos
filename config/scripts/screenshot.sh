screenshot() {
    ssDir=~/Pictures/Screenshots

    if [ ! -d $ssDir ]; then
        mkdir -p $ssDir
    fi

    if [ "$#" -eq  "0" ]
    then
        IMG=$ssDir/$(date +'Screenshot_%Y-%m-%d_%H-%M-%S.png') && grim "$IMG" && notify-send "Screenshot" "Saved and Copied";
    else
        IMG=$ssDir/$(date +'Screenshot_%Y-%m-%d_%H-%M-%S.png') && grim -g "$(slurp -c cba6f788 -b 00000055 -w 0)" "$IMG" && notify-send "Screenshot" "Saved and Copied";
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
    *)                                  screenshot "$@" ;;
esac
exit 0
