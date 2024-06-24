{ config, pkgs, ... }:

let
  toggleidle = pkgs.writeShellApplication {
    name = "toggleidle";
    text = builtins.readFile ../../config/scripts/swayidle.sh;
  };
in
{
  home.packages = [ toggleidle ];
}
