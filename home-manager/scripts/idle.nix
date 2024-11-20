{ config, lib, pkgs, ... }:

with lib;

let
  idle = pkgs.writeShellApplication {
    name = "idle";
    runtimeInputs = with pkgs; [
      hyprlock
      hypridle
      playerctl
      # swayidle
      # swaylock
    ];
    text = builtins.readFile ../../config/scripts/idle.sh;
  };

  cfg = config.module.scripts.idle;
in
{
  options = {
    module.scripts.idle.enable = mkEnableOption "Enables idle scripts";
  };

  config = mkIf cfg.enable {
    home.packages = [ idle ];
  };
}
