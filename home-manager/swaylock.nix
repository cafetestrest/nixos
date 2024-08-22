{ config, lib, ... }:

with lib;

let
  cfg = config.module.screen-locker.swaylock;
in
{
  options = {
    module.screen-locker.swaylock.enable = mkEnableOption "Enables swaylock config";
  };

  config = mkIf cfg.enable {
    home.file = {
      ".config/swaylock/config" = {
        source = ../config/swaylock/config;
      };
    };
  };
}
