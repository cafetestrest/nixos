{ config, pkgs, ... }:

let
  idle = pkgs.writeShellApplication {
    name = "idle";
    runtimeInputs = with pkgs; [
      unstable.hyprlock
      unstable.hypridle
      playerctl
      # swayidle
      # swaylock
    ];
    text = builtins.readFile ../../config/scripts/idle.sh;
  };
in
{
  home.packages = [ idle ];
}
