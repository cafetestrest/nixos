{ config, pkgs, ... }:

let
  openweathermap = pkgs.writeShellApplication {
    name = "openweathermap";
    runtimeInputs = with pkgs; [
      bc
      jq
    ];
    text = builtins.readFile ../../config/scripts/openweathermap.sh;
  };
in
{
  home.packages = [ openweathermap ];
}
