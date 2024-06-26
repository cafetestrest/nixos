ssDir=~/Pictures/Screenshots

if [ ! -d $ssDir ]; then
    mkdir $ssDir
fi

if [ "$#" -eq  "0" ]
then
    IMG=$ssDir/$(date +'Screenshot_%Y-%m-%d_%H-%M-%S.png') && grim "$IMG" && notify-send "Screenshot" "Saved and Copied";
else
    IMG=$ssDir/$(date +'Screenshot_%Y-%m-%d_%H-%M-%S.png') && grim -g "$(slurp -c cba6f788 -b 00000055 -w 0)" "$IMG" && notify-send "Screenshot" "Saved and Copied";
fi