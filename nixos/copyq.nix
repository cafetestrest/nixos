{ config, pkgs, ... }:

{
  environment.systemPackages = with pkgs; [
    copyq                 #copy/paste things
  ];

  imports = [
    ./ydotool.nix
  ];

  environment.shellInit = ''
    check_copyq() {
      if ! pgrep -x "copyq" >/dev/null; then
        if [ -n "$HYPRLAND_CMD" ]; then
          QT_QPA_PLATFORM=wayland copyq --start-server &
        fi
      fi
    }

    # Call the function on shell startup
    check_copyq
  '';
}
