{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.programs.copyq;
  cfgHyprland = config.module.desktop-environment.hyprland;
in
{
  options = {
    module.programs.copyq.enable = mkEnableOption "Enables copyq";
  };

  config = mkIf cfg.enable {
    environment.systemPackages = with pkgs; [
      copyq                 #copy/paste things
    ];

    environment.shellInit = lib.mkIf cfgHyprland.enable ''
      check_copyq() {
        if ! pgrep "copyq" > /dev/null; then
            if [ -n "$HYPRLAND_CMD" ]; then
                QT_QPA_PLATFORM=wayland copyq --start-server &
            fi
        fi
      }

      # Call the function on shell startup
      check_copyq
    '';
  };
}
