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
    eww-wayland
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
    };
  };
}
