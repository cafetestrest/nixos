{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.xdg;
  cfgHyprland = config.module.desktop-environment.hyprland;
in
{
  options = {
    module.xdg.enable = mkEnableOption "Enables xdg portal";
  };

  config = mkIf cfg.enable {
    xdg.portal = {
      enable = true;
      extraPortals = lib.optionals cfgHyprland.enable [ pkgs.xdg-desktop-portal-gtk ];
    };
  };
}
