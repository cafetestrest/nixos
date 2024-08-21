{ config, lib, ... }:

with lib;

let
  cfg = config.module.services.wireless;
in
{
  options = {
    module.services.wireless.enable = mkEnableOption "Enables wireless support via wpa_supplicant";
  };

  config = mkIf cfg.enable {
    networking.wireless.enable = true;
  };
}
