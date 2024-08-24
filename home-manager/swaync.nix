{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.packages.swaync;
in
{
  options = {
    module.packages.swaync.enable = mkEnableOption "Enables swaync";
  };

  config = mkIf cfg.enable {
    home.packages = with pkgs; [
      swaynotificationcenter     #notifications
    ];

    home.file = {
      #swaync config
      ".config/swaync/config.json" = {
        source = ../config/swaync/config.json;
      };

      #swaync style
      ".config/swaync/style.css" = {
        source = ../config/swaync/style.css;
      };
    };
  };
}
