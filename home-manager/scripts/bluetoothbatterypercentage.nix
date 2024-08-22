{ config, lib, pkgs, ... }:

with lib;

let
  bluetoothbatterypercentage = pkgs.writeShellApplication {
    name = "bluetoothbatterypercentage";
    text = builtins.readFile ../../config/scripts/bluetoothbatterypercentage.sh;
  };

  cfg = config.module.scripts.bluetoothbatterypercentage;
in
{
  options = {
    module.scripts.bluetoothbatterypercentage.enable = mkEnableOption "Enables bluetoothbatterypercentage scripts";
  };

  config = mkIf cfg.enable {
    home.packages = [ bluetoothbatterypercentage ];
  };
}
