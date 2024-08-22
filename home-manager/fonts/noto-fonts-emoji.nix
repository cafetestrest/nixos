{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.fonts.noto-fonts-emoji;
in
{
  options = {
    module.fonts.noto-fonts-emoji.enable = mkEnableOption "Enables font noto-fonts-emoji";
  };

  config = mkIf cfg.enable {
    home.packages = with pkgs; [
      noto-fonts-emoji
    ];
  };
}
