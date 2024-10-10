{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.xdg;
  cfgHyprland = config.module.desktop-environment.hyprland;
  cfgGnome = config.module.desktop-environment.gnome;
in
{
  options = {
    module.xdg.enable = mkEnableOption "Enables xdg portal";
  };

  config = mkIf cfg.enable {
    xdg.portal = {
      enable = true;
      extraPortals = lib.optionals cfgHyprland.enable (
        if cfgGnome.enable then [] else [ pkgs.xdg-desktop-portal-gtk ]
      );
    };
  };
}
