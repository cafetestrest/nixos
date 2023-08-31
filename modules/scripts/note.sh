#!/usr/bin/env bash

documentsDir=~/Documents
noteFile=note

if [ ! -f $documentsDir/$noteFile ]; then
    touch $documentsDir/$noteFile
    echo "test\n" >> $documentsDir/$noteFile
fi

note=''
while IFS= read -r line || [[ $line ]];
do
    note+="$line\r"
    # echo $line;
done < $documentsDir/$noteFile

note=${note::-2}

firstArg="$(echo "$1")"

if [[ $firstArg == "ags" ]]; then
    ags run-js "ags.Service.Note.setNote(\"$note\")"
else
    echo "{\"text\":\"\", \"tooltip\":\"${note}\"}"
fi