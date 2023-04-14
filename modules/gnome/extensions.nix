{ config, pkgs, ... }:

let
  inherit (import ../../variables.nix)
    user;
in
{
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
