{ config, pkgs, ... }:

let
  bluetoothbatterypercentage = pkgs.writeShellApplication {
    name = "bluetoothbatterypercentage";
    text = builtins.readFile ../../config/scripts/bluetoothbatterypercentage.sh;
  };
in
{
  home.packages = [ bluetoothbatterypercentage ];
}
