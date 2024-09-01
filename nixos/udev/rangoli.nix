{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.services.udev.rangoli;
in
{
  options = {
    module.services.udev.rangoli.enable = mkEnableOption "Enables rangoli udev rules";
  };

  config = mkIf cfg.enable {
  # 1. On installation of rangoli.nix log out of the session

  # 2. installation (use distrobox - ubuntu -> enable it in home-manager)
  # sudo apt install libxcb-xinerama0
  # sudo apt install xterm
  # sudo apt install libxcb-icccm4 libxcb-image0 libxcb-keysyms1 libxcb-randr0 libxcb-render-util0 libxcb-xkb1 libxcb-shape0 libxkbcommon-x11-0
  # sudo apt install libxcb-xfixes0 libegl1-mesa
  # sudo apt install qt5-wayland
  # sudo apt install qtwayland5 libqt5gui5
  # sudo apt install qt5-qpa-plugins
  # sudo apt install execvp
  # sudo apt install cmake
  # sudo apt install gcc ninja
  # sudo apt install libgl1
  # sudo apt install mesa-utils
  # sudo apt install libopengl0 -y
  # sudo apt install freeglut3 freeglut3-dev
  
  # sudo apt update && sudo apt upgrade

  # 3. download .run: https://github.com/rnayabed/rangoli/releases (try with sudo if normal does not work)
  # sudo chmod +x rangoli-installer-linux-64.run
  # ./rangoli-installer-linux-64.run

  # 4. edit out: bin/udev-rule-writer.sh
  # udev_rule_path = "/home/$USER/Downloads/rangoli/udev"

  # 5. launch rangoli with the following command:
  # QT_QPA_PLATFORM=xcb bin/rangoli

    services.udev.extraRules = ''
      # START Rangoli udev rules
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="00b3", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="00aa", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="00a5", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="010d", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="0053", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="002a", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="00f3", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="00c3", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="0066", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="00c4", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="0069", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="007b", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="0059", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="0056", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="0055", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="0068", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="00c6", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="00e7", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="00a9", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="0089", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="00ed", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="007a", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="004f", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="00e0", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="00a2", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="00a6", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="00ea", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="008e", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="0058", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="007d", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="0074", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="009e", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="005d", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="00f6", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="007c", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="005e", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="004b", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="004c", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="00e1", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="00c8", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="00da", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="0049", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="00b5", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="0078", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="00ef", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="004a", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="00c1", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="00a4", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="0060", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="008f", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="0075", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="01ff", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="0052", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="00cd", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="0064", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="006a", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="00de", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="00c9", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="0057", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="009c", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="004e", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="00ff", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="00ec", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="00c0", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="006f", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="0067", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="010a", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="00f9", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="00b8", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="006b", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="008b", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="00f7", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="00d6", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="005b", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="0054", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="005c", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="00f4", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="004d", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="0103", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="0065", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="0102", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="0048", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="00d8", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="005a", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="008c", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="0070", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="00f8", TAG+="uaccess"
      KERNEL=="hidraw*", ATTRS{idVendor}=="258a", ATTRS{idProduct}=="0079", TAG+="uaccess"
      # END Rangoli udev rules
    '';
  };
}
