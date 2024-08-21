{ config, lib, ... }:

with lib;

let
  cfg = config.module.drive.ssd;
in
{
  options = {
    module.drive.ssd.enable = mkEnableOption "Enables SSD optimisation";
  };

  config = mkIf cfg.enable {
    services.fstrim.enable = lib.mkDefault true;
    nix.settings.auto-optimise-store = true;
  };
}
