{ config, pkgs, ... }:

let
  startup = pkgs.writeShellApplication {
    name = "startup";
    text = builtins.readFile ../../config/scripts/startup.sh;
  };
in
{
  home.packages = [ startup ];
}
