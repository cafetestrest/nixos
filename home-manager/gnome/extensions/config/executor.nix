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
      right-commands-json="{\"commands\":[{\"isActive\":true,\"command\":\"echo \\\"︁   \\\" && top -bn 1 | grep 'Cpu(s)' | awk '{print $2 + $4}' && echo \\\"%   \\\"\",\"interval\":10,\"uuid\":\"466e3df9-6444-4baa-99f2-4e8f79e88afd\"},{\"isActive\":true,\"command\":\"echo \\\"︁  \\\" && free --giga -h | grep 'Mem' | awk '{print $3}'\",\"interval\":10,\"uuid\":\"fc98e123-e8b4-4bf4-95e1-4bb78ef6445d\"},{\"isActive\":true,\"command\":\"echo \\\"    \\\" && df -h / | awk 'NR==2 {print $5}'\",\"interval\":10,\"uuid\":\"e27c2ca5-5c88-4a68-bc88-35cc4915f63a\"},{\"isActive\":true,\"command\":\"upower -i $(upower -e | grep 'mouse') | grep -E \\\"percentage\\\" | awk '{ if($2 != \\\"\\\" && $2 != \\\"0%\\\") print \\\"    🖱 \\\" $2;}'\",\"interval\":10,\"uuid\":\"69c517f6-1188-4a3b-99dd-2625b985d640\"},{\"isActive\":true,\"command\":\"upower -i $(upower -e | grep 'keyboard') | grep -E \\\"percentage\\\" | awk '{ if($2 != \\\"\\\" && $2 != \\\"0%\\\") print \\\"   ⌨️ \\\" $2;}'\",\"interval\":10,\"uuid\":\"a7c211eb-605d-4795-bf45-1aee7a65525b\"},{\"isActive\":true,\"command\":\"if wpctl inspect @DEFAULT_AUDIO_SINK@ | grep -q 'alsa.driver_name.*usb'; then echo \\\"  🎧 $(headsetcontrol -b -c)% | $(headsetcontrol -c -m)\\\"; else echo \\\"   \\\" && awk -F\\\"[][]\\\" '/Left:/ { print $2 }' <(amixer sget Master); fi\",\"interval\":5,\"uuid\":\"a50f8d44-e2c5-48e6-9a57-c08222d26525\"}]}";
      right-index=1;
    };
  };
}
