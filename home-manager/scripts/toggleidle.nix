{ config, pkgs, ... }:

let
  toggleidle = pkgs.writeShellApplication {
    name = "toggleidle";
    runtimeInputs = with pkgs; [
      unstable.hypridle
    ];
    text = builtins.readFile ../../config/scripts/toggleidle.sh;
  };
in
{
  home.packages = [ toggleidle ];
}
