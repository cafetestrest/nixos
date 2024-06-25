documentsDir=~/Documents
noteFile=note.md

if [ ! -f $documentsDir/$noteFile ]; then
    touch $documentsDir/$noteFile
    printf 'test\n' >> "$documentsDir/$noteFile"
fi

note=''
while IFS= read -r line || [[ $line ]];
do
    note+="$line\r"
    # echo $line;
done < $documentsDir/$noteFile

note=${note::-2}

#checks the first letter of the argument provided to the script
if [[ $# -ge 1 ]]; then
    firstArgLetter="$(echo "$1" | head -c 1)"
else
    firstArgLetter=
fi

if [[ $firstArgLetter == "a" ]]; then
    ags -r "note.setNote(\"$note\")"
else
    echo "{\"text\":\"\", \"tooltip\":\"${note}\"}"
fi
