{ config, pkgs, ... }:

let
  inherit (import ../../variables.nix)
    user;
in
{
  imports =
    [
      #gnome extensions dconf configuration
      ./gnome/extensions/config/blur-my-shell.nix
      ./gnome/extensions/config/caffeine.nix
      ./gnome/extensions/config/dash-to-panel.nix
      ./gnome/extensions/config/executor.nix
      ./gnome/extensions/config/gtile.nix
      #./gnome/extensions/config/super-key.nix
      ./gnome/extensions/config/useless-gaps.nix
    ];

  users.users.${user} = {
    packages = with pkgs; [
      gnomeExtensions.user-themes
      gnomeExtensions.dash-to-panel
      gnomeExtensions.caffeine
      gnomeExtensions.blur-my-shell
      gnomeExtensions.executor
      gnomeExtensions.fuzzy-app-search
      gnomeExtensions.gsconnect
      gnomeExtensions.gtile
      gnomeExtensions.no-overview
      gnomeExtensions.openweather
      gnomeExtensions.rounded-window-corners
      #gnomeExtensions.super-key
      gnomeExtensions.useless-gaps
      gnomeExtensions.workspace-indicator
      gnomeExtensions.tray-icons-reloaded
    ];
  };
}
