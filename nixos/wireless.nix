{ config, lib, ... }:

with lib;

let
  cfg = config.module.hardware.wireless;
in
{
  options = {
    module.hardware.wireless.enable = mkEnableOption "Enables wireless support via wpa_supplicant";
  };

  config = mkIf cfg.enable {
    networking.wireless.enable = true;
  };
}
