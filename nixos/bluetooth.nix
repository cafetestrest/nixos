{ config, lib, ... }:

with lib;

let
  cfg = config.module.services.bluetooth;
in
{
  options = {
    module.services.bluetooth.enable = mkEnableOption "Enables bluetooth";
  };

  config = mkIf cfg.enable {
    # Enable bluetooth
    hardware.bluetooth = {
      enable = true;
      settings.General.Experimental = true;
    };

    services.blueman.enable = true;
  };
}
