{ config, pkgs, ... }:

let
  toggleidle = pkgs.writeShellApplication {
    name = "toggleidle";
    text = builtins.readFile ../../config/scripts/toggleidle.sh;
  };
in
{
  home.packages = [ toggleidle ];
}
