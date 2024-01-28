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
      right-commands-json="{\"commands\":[{\"isActive\":true,\"command\":\"echo \\\"︁   \\\" && top -bn 1 | grep 'Cpu(s)' | awk '{print $2 + $4}' && echo \\\"%   \\\"\",\"interval\":10,\"uuid\":\"d9636313-7e83-4a26-8206-70cbc8b7d9fd\"},{\"isActive\":true,\"command\":\"echo \\\"︁  \\\" && free --giga -h | grep 'Mem' | awk '{print $3}'\",\"interval\":10,\"uuid\":\"ba658256-c215-47b2-bd7f-2dc45b4258fc\"},{\"isActive\":true,\"command\":\"echo \\\"    \\\" && df -h / | awk 'NR==2 {print $5}'\",\"interval\":10,\"uuid\":\"63f9eaff-6269-4026-bb99-96324bd2d853\"},{\"isActive\":true,\"command\":\"upower -i $(upower -e | grep 'mouse') | grep -E \\\"percentage\\\" | awk '{ if($2 != \\\"\\\" && $2 != \\\"0%\\\") print \\\"    🖱 \\\" $2;}'\",\"interval\":10,\"uuid\":\"c4711ec0-487d-4dc3-acde-d91548431914\"},{\"isActive\":true,\"command\":\"upower -i $(upower -e | grep 'keyboard') | grep -E \\\"percentage\\\" | awk '{ if($2 != \\\"\\\" && $2 != \\\"0%\\\") print \\\"   ⌨️ \\\" $2;}'\",\"interval\":10,\"uuid\":\"507c2f68-768e-4c10-adf8-dfac368b62a4\"},{\"isActive\":false,\"command\":\"headsetcontrol -b | grep 'Battery' | awk '{if($2 != \\\"\\\" && $2 != \\\"0%\\\") print \\\"🎧 \\\" $2;}'\",\"interval\":10,\"uuid\":\"8ff55c0a-4f73-4a26-b05a-39d45e2d11ed\"},{\"isActive\":true,\"command\":\"wpctl inspect @DEFAULT_AUDIO_SINK@ | grep -q 'alsa.driver_name.*usb' && echo \\\"  󰋋\\\" || :\",\"interval\":10,\"uuid\":\"8e96fa30-bdec-439a-a86d-34ac05d6a0c4\"}]}";
      right-index=1;
    };
  };
}
