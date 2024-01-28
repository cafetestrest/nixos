{ config, pkgs, ... }:

{
  dconf.settings = {
    "org/gnome/shell/extensions/executor" = {
      center-active=false;
      center-commands-json="{\"commands\":[{\"isActive\":true,\"command\":\"echo $(echo $(playerctl metadata | grep -E artist | awk '{for (i=3; i<=NF; i++) printf $i \\\" \\\"}' | awk '{print $0\\\"-\\\"}') $(playerctl metadata | grep -E title | awk '{for (i=3; i<=NF; i++) printf $i \\\" \\\"}') | cut -c1-50)\",\"interval\":5,\"uuid\":\"cd5a3b3d-e7f9-4fa8-84f4-80ff5cb07e08\"}]}";
      center-index=0;
      click-on-output-active=false;
      left-active=false;
      location=2;
      right-commands-json="{\"commands\":[{\"isActive\":true,\"command\":\"upower -i $(upower -e | grep 'mouse') | grep -E \\\"percentage\\\" | awk '{ if($2 != \\\"\\\" && $2 != \\\"0%\\\") print \\\"🖱 \\\" $2;}'\",\"interval\":10,\"uuid\":\"25b276da-91db-46e9-8bc3-ec81607b4ba9\"},{\"isActive\":true,\"command\":\"upower -i $(upower -e | grep 'keyboard') | grep -E \\\"percentage\\\" | awk '{ if($2 != \\\"\\\" && $2 != \\\"0%\\\") print \\\"   ⌨️ \\\" $2;}'\",\"interval\":10,\"uuid\":\"aa9fd14e-1b25-447a-b0cf-cca21da37e49\"},{\"isActive\":false,\"command\":\"headsetcontrol -b | grep 'Battery' | awk '{if($2 != \\\"\\\" && $2 != \\\"0%\\\") print \\\"🎧 \\\" $2;}'\",\"interval\":10,\"uuid\":\"0fd84ab8-5c1d-4d5e-b102-8ff78e157315\"}]}";
      right-index=1;
    };
  };
}
