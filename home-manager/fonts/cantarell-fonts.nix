{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.fonts.cantarell-fonts;
in
{
  options = {
    module.fonts.cantarell-fonts.enable = mkEnableOption "Enables font cantarell-fonts";
  };

  config = mkIf cfg.enable {
    home.packages = with pkgs; [
      cantarell-fonts                 # default font on ubuntu, used on gtklock
    ];
  };
}
