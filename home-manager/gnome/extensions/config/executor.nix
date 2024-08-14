{ config, pkgs, ... }:

{
  dconf.settings = {
    "org/gnome/shell/extensions/executor" = {
      center-active=false;
      center-commands-json="{\"commands\":[{\"isActive\":true,\"command\":\"echo $(echo $(${pkgs.playerctl}/bin/playerctl metadata | grep -E artist | awk '{for (i=3; i<=NF; i++) printf $i \\\" \\\"}' | awk '{print $0\\\"-\\\"}') $(${pkgs.playerctl}/bin/playerctl metadata | grep -E title | awk '{for (i=3; i<=NF; i++) printf $i \\\" \\\"}') | cut -c1-50)\",\"interval\":5,\"uuid\":\"cd5a3b3d-e7f9-4fa8-84f4-80ff5cb07e08\"}]}";
      center-index=0;
      click-on-output-active=false;
      left-active=false;
      location=2;
      right-commands-json="{\"commands\":[{\"isActive\":true,\"command\":\"echo \\\"︁   \\\" && top -bn 1 | grep 'Cpu(s)' | awk '{print $2 + $4}' && echo \\\"%   \\\"\",\"interval\":10,\"uuid\":\"2c27da84-e32b-4d0d-95d7-13e91faaeb84\"},{\"isActive\":true,\"command\":\"echo \\\"︁  \\\" && free --giga -h | grep 'Mem' | awk '{print $3}'\",\"interval\":10,\"uuid\":\"bdcfdffc-3db6-4c30-9c68-5299330356a3\"},{\"isActive\":true,\"command\":\"echo \\\"    \\\" && df -h / | awk 'NR==2 {print $5}'\",\"interval\":10,\"uuid\":\"225c7982-415c-41d8-871e-913e0f3cf5d6\"},{\"isActive\":true,\"command\":\"upower -i $(upower -e | grep 'mouse') | grep -E \\\"percentage\\\" | awk '{ if($2 != \\\"\\\" && $2 != \\\"0%\\\") print \\\"    🖱 \\\" $2;}'\",\"interval\":10,\"uuid\":\"403c1ad8-2e2d-465b-9cf9-ca10ccadf8c2\"},{\"isActive\":true,\"command\":\"upower -i $(upower -e | grep 'keyboard') | grep -E \\\"percentage\\\" | awk '{ if($2 != \\\"\\\" && $2 != \\\"0%\\\") print \\\"   ⌨️ \\\" $2;}'\",\"interval\":10,\"uuid\":\"d5d26905-c9d0-4769-a79c-3856f220a6dc\"},{\"isActive\":true,\"command\":\"if wpctl inspect @DEFAULT_AUDIO_SINK@ | grep -q 'alsa.driver_name.*usb'; then echo \\\"\\\" | awk '{if (battery > 0) { printf icon\\\" \\\"; printf \\\" \\\"battery\\\"%\\\"; print \\\" | \\\"vcm} else { print icon, \\\"Off\\\"} }' vcm=\\\"`${pkgs.headsetcontrol}/bin/headsetcontrol -o env | grep DEVICE_0_CHATMIX | cut -d'=' -f2`\\\" battery=\\\"`${pkgs.headsetcontrol}/bin/headsetcontrol -o env | grep DEVICE_0_BATTERY_LEVEL | cut -d'=' -f2`\\\" icon=\\\"   🎧\\\"; fi\",\"interval\":10,\"uuid\":\"509ae135-fd26-4132-9daa-528c8300c275\"}]}";
      right-index=1;
    };
  };
}
