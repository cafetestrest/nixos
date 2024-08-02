{ config, pkgs, ... }:

let
  btupowerbatterypercentage = pkgs.writeShellApplication {
    name = "btupowerbatterypercentage";
    text = builtins.readFile ../../config/scripts/btupowerbatterypercentage.sh;
  };
in
{
  home.packages = [ btupowerbatterypercentage ];
}
