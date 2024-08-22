{ config, lib, pkgs, ... }:

with lib;

let
  nerdfonts = (pkgs.nerdfonts.override { fonts = [
    "Ubuntu"
    "UbuntuMono"
    "CascadiaCode"
    "FantasqueSansMono"
    "FiraCode"
    "Mononoki"
  ]; });

  cfg = config.module.fonts.nerdfonts;
in
{
  options = {
    module.fonts.nerdfonts.enable = mkEnableOption "Enables font nerdfonts";
  };

  config = mkIf cfg.enable {
    home.packages = with pkgs; [
      nerdfonts
    ];
  };
}
