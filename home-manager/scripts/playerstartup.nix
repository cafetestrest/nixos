{ config, pkgs, ... }:

let
  playerstartup = pkgs.writeShellApplication {
    name = "playerstartup";
    text = builtins.readFile ../../config/scripts/playerstartup.sh;
  };
in
{
  home.packages = [ playerstartup ];
}
