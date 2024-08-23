{ config, lib, ... }:

with lib;

let
  cfg = config.module.hardware.bluetooth;
  bluemanCfg = config.module.hardware.bluetooth.blueman;
in
{
  options = {
    module.hardware.bluetooth.enable = mkEnableOption "Enables bluetooth";
    module.hardware.bluetooth.blueman.enable = mkEnableOption "Enables Blueman for Bluetooth management";
  };

  config = mkIf cfg.enable {
    # Enable bluetooth
    hardware.bluetooth = {
      enable = true;
      settings.General.Experimental = true;
    };

    services.blueman.enable = bluemanCfg.enable;
  };
}
