
read -r -d '' copyqjs << EOM
for (var i = 0; i < size(); i++) {
  var lines = str(read(i)).split(/[\r\n]+/);
  var line = "";
  if (lines.length > 1) {
    line = lines[0] + " (+" + str(lines.length - 1) + " more lines)";
  } else {
    line = lines[0];
  }
  if (line == "") {
      line = '<probably image>';
  }
  print(i + " " + line + "\n");
}
EOM

echo "$copyqjs" | copyq eval - | awk '{ $1=""; print $0 }'
