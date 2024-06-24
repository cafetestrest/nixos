{ config, pkgs, ... }:

let
  yrweather = pkgs.writeShellApplication {
    name = "yrweather";
    text = builtins.readFile ../../config/scripts/yrweather.sh;
  };
in
{
  home.packages = [ yrweather ];
}
