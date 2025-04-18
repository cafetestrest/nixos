{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.wifi;
in
{
  options = {
    module.wifi.enable = mkEnableOption "Enables WIFI";
  };

  config = mkIf cfg.enable {
    networking = {
      networkmanager = {
        enable = true;
        wifi = {
          scanRandMacAddress = false; # Can help with faster reconnection
          powersave = false; # Disable power saving for faster connections
        };
      };
    };
  };
}
