{ config, lib, inputs, pkgs, ... }:

with lib;

let
  cfg = config.module.desktop-environment.hyprland;
  cfgServices = config.module.desktop-environment.hyprland.services;
in
{
  options = {
    module.desktop-environment.hyprland.enable = mkEnableOption "Enables Hyprland DE";
    module.desktop-environment.hyprland.services.enable = mkEnableOption "Enables Hyprland services";
  };

  config = mkIf cfg.enable {
    services.xserver.displayManager.startx.enable = true;

    programs.hyprland = {
      enable = true;
      package = inputs.hyprland.packages.${pkgs.stdenv.hostPlatform.system}.hyprland;
      portalPackage = inputs.hyprland.packages.${pkgs.stdenv.hostPlatform.system}.xdg-desktop-portal-hyprland;
      xwayland.enable = true;
    };

    nix.settings = {
      substituters = ["https://hyprland.cachix.org"];
      trusted-public-keys = ["hyprland.cachix.org-1:a7pgxzMz7+chwVL3/pzj6jIBMioiJM7ypFP8PwtkuGc="];
    };

    # environment.sessionVariables.NIXOS_OZONE_WL = "1"; # Hint electron apps to use wayland
    # environment.sessionVariables = {
    #   ELECTRON_OZONE_PLATFORM_HINT = "auto";
    #   NIXOS_OZONE_WL = "1";
    # };

    # hardware.opengl = {
    #   package = pkgs-unstable-hyprland.mesa.drivers;  # Hotfix for following unstable branch
    # };

    services = {
      # gvfs.enable = cfgServices.enable; #allows applications to access various types of file systems (local, remote, etc.)
      # devmon.enable = cfgServices.enable; #(Device Monitor) automates the mounting and unmounting of removable devices like USB drives
      # udisks2.enable = cfgServices.enable;  #tools, and a library to handle storage devices and disk management
      # colord.enable = cfgServices.enable;  #Whether to enable colord, the color management daemon
      upower.enable = cfgServices.enable; #provides power management support, primarily for battery-powered devices
      # power-profiles-daemon.enable = cfgServices.enable;  #manages and applies power profiles (like power saving or performance)
      # accounts-daemon.enable = cfgServices.enable;  #provides user account information to applications login details and user-specific
      # gnome = {
      #   evolution-data-server.enable = cfgServices.enable;  # applications that manage contacts, calendars, tasks, and notes
      #   glib-networking.enable = cfgServices.enable;  #support for secure connections using TLS/SSL
      #   gnome-keyring.enable = cfgServices.enable;  #stores and manages security credentials like passwords and encryption keys
      #   # gnome-online-accounts.enable = cfgServices.enable;  #GNOME Online Accounts integrates online services (like Google, Facebook)
      # };
    };
  };
}
