{ config, lib, pkgs, ... }:

let
  inherit (import ../../variables.nix)
    user;
in
{
  environment.systemPackages = with pkgs; [
    waybar
    # pavucontrol
    # python3Minimal
    jq
    pamixer
    # font-manager
  ];

  home-manager.users.${user} = {
    home.file = {
      #waybar config
      ".config/waybar/config.jsonc" = {
        source = ./config/config.jsonc;
      };

      #waybar style
      ".config/waybar/style.css" = {
        source = ./config/style.css;
      };

      #waybar script - weather.sh
      ".config/waybar/scripts/weather.sh" = {
        source = ./config/scripts/weather.sh;
        executable = true;
      };
      #waybar script - weather.sh secrets - update
      ".config/waybar/scripts/weather_sh.rc" = {
        source = ./config/scripts/weather_sh.rc;
      };

      #waybar script - battery.sh
      ".config/waybar/scripts/battery.sh" = {
        source = ./config/scripts/battery.sh;
        executable = true;
      };

      #waybar script - note.sh
      ".config/waybar/scripts/note.sh" = {
        source = ./config/scripts/note.sh;
        executable = true;
      };

      #waybar script - screenshot.sh
      ".config/waybar/scripts/screenshot.sh" = {
        source = ./config/scripts/screenshot.sh;
        executable = true;
      };

      #power menu script - hyprland bindings and waybar
      ".config/waybar/scripts/powermenu.sh" = {
        source = ./config/scripts/powermenu.sh;
        executable = true;
      };
    };
  };
}
