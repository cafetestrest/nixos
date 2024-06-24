{ config, pkgs, ... }:

let
  screenshot = pkgs.writeShellApplication {
    name = "screenshot";
    text = builtins.readFile ../../config/scripts/screenshot.sh;
  };
in
{
  home.packages = [ screenshot ];
}
