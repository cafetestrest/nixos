{ config, pkgs, ... }:

let
  nightlight = pkgs.writeShellApplication {
    name = "nightlight";
    text = builtins.readFile ../../config/scripts/nightlight.sh;
  };
in
{
  home.packages = [ nightlight ];
}
