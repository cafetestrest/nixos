{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.fonts.montserrat;
in
{
  options = {
    module.fonts.montserrat.enable = mkEnableOption "Enables font montserrat";
  };

  config = mkIf cfg.enable {
    home.packages = with pkgs; [
      montserrat                      # for rofi
    ];
  };
}
