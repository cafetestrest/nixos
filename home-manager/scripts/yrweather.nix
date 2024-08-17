{ config, pkgs, ... }:

let
  yrweather = pkgs.writeShellApplication {
    name = "yrweather";
    runtimeInputs = with pkgs; [
      bc
      jq
    ];
    text = builtins.readFile ../../config/scripts/yrweather.sh;
  };
in
{
  home.packages = [ yrweather ];
}
