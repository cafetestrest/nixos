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
      right-commands-json="{\"commands\":[{\"isActive\":true,\"command\":\"echo \\\"︁   \\\" && top -bn 1 | grep 'Cpu(s)' | awk '{print $2 + $4}' && echo \\\"%   \\\"\",\"interval\":10,\"uuid\":\"b75b5baa-6826-404e-aa7d-5247a521a8fd\"},{\"isActive\":true,\"command\":\"echo \\\"︁  \\\" && free --giga -h | grep 'Mem' | awk '{print $3}'\",\"interval\":10,\"uuid\":\"a1bbce5d-e610-4a6a-b7eb-3122c15393d6\"},{\"isActive\":true,\"command\":\"echo \\\"    \\\" && df -h / | awk 'NR==2 {print $5}'\",\"interval\":10,\"uuid\":\"25523819-6bed-4a2d-9f7d-88d44dae4b86\"},{\"isActive\":true,\"command\":\"upower -i $(upower -e | grep 'mouse') | grep -E \\\"percentage\\\" | awk '{ if($2 != \\\"\\\" && $2 != \\\"0%\\\") print \\\"    🖱 \\\" $2;}'\",\"interval\":10,\"uuid\":\"18382e4d-72f2-4708-a4b9-fcef9cab0c1d\"},{\"isActive\":true,\"command\":\"upower -i $(upower -e | grep 'keyboard') | grep -E \\\"percentage\\\" | awk '{ if($2 != \\\"\\\" && $2 != \\\"0%\\\") print \\\"   ⌨️ \\\" $2;}'\",\"interval\":10,\"uuid\":\"eed36d4a-902a-411b-b65b-6a0072a6f217\"},{\"isActive\":true,\"command\":\"if wpctl inspect @DEFAULT_AUDIO_SINK@ | grep -q 'alsa.driver_name.*usb'; then echo \\\"\\\" | awk '{if (battery > 0) { printf icon\\\" \\\"; printf \\\" \\\"battery\\\"%\\\"; print \\\" | \\\"vcm} else { print icon, \\\"Off\\\"} }' vcm=\\\"`headsetcontrol -c -m`\\\" battery=\\\"`headsetcontrol -b -c`\\\" icon=\\\"   🎧\\\"; else echo \\\"   \\\" && awk -F\\\"[][]\\\" '/Left:/ { print $2 }' <(amixer sget Master); fi\",\"interval\":5,\"uuid\":\"40209cc4-2b8e-4db5-b082-f4e21061c05c\"}]}";
      right-index=1;
    };
  };
}
