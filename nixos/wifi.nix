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
    networking.networkmanager.wifi.scanRandMacAddress = false;  # hotfix to make wifi work properly
  };
}
