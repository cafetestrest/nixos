{ config, pkgs, ... }:

let
  openweathermap = pkgs.writeShellApplication {
    name = "openweathermap";
    runtimeInputs = with pkgs; [
      bc
    ];
    text = builtins.readFile ../../config/scripts/openweathermap.sh;
  };
in
{
  home.packages = [ openweathermap ];
}
