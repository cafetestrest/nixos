{ config, lib, ... }:

with lib;

let
  cfg = config.module.packages.copyq;
in
{
  options = {
    module.packages.copyq.enable = mkEnableOption "Enables copyq config";
  };

  config = mkIf cfg.enable {
    home.file = {
      ".config/copyq/copyq.conf" = {
        source = ../config/copyq/copyq.conf;
      };

      ".config/copyq/copyq-commands.ini" = {
        source = ../config/copyq/copyq-commands.ini;
      };
    };
  };
}
