{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.fonts.ubuntu-font-family;
in
{
  options = {
    module.fonts.ubuntu-font-family.enable = mkEnableOption "Enables font ubuntu_font_family";
  };

  config = mkIf cfg.enable {
    home.packages = with pkgs; [
      ubuntu_font_family
    ];
  };
}
