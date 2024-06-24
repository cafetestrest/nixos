{ config, pkgs, ... }:

let
  idle = pkgs.writeShellApplication {
    name = "idle";
    text = builtins.readFile ../../config/scripts/idle.sh;
  };
in
{
  home.packages = [ idle ];
}
