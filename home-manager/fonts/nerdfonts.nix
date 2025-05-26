{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.fonts.nerdfonts;
in
{
  options = {
    module.fonts.nerdfonts.enable = mkEnableOption "Enables font nerdfonts";
  };

  config = mkIf cfg.enable {
    home.packages = with pkgs.nerd-fonts; [
      ubuntu
      ubuntu-mono
      caskaydia-cove
    ];
  };
}
