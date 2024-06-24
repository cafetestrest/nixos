{ config, pkgs, ... }:

let
  openweathermap = pkgs.writeShellApplication {
    name = "openweathermap";
    text = builtins.readFile ../../config/scripts/openweathermap.sh;
  };
in
{
  home.packages = [ openweathermap ];
}
