{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.programs.copyq;
in
{
  options = {
    module.programs.copyq.enable = mkEnableOption "Enables copyq";
  };

  config = mkIf cfg.enable {
    environment.systemPackages = with pkgs; [
      copyq                 #copy/paste things  #TODO move to hm?
    ];

    # imports = [
    #   ./ydotool.nix
    # ];

    #TODO add config support?
    environment.shellInit = ''
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
