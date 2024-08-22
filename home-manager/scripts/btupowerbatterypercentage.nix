{ config, lib, pkgs, ... }:

with lib;

let
  btupowerbatterypercentage = pkgs.writeShellApplication {
    name = "btupowerbatterypercentage";
    text = builtins.readFile ../../config/scripts/btupowerbatterypercentage.sh;
  };

  cfg = config.module.scripts.btupowerbatterypercentage;
in
{
  options = {
    module.scripts.btupowerbatterypercentage.enable = mkEnableOption "Enables btupowerbatterypercentage scripts";
  };

  config = mkIf cfg.enable {
    home.packages = [ btupowerbatterypercentage ];
  };
}
