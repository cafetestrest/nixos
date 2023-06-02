{ config, pkgs, ... }:

let
  inherit (import ../../variables.nix)
    user;
in
{
  users.users.${user} = {
    packages = with pkgs; [
    ];
  };

  environment.systemPackages = with pkgs; [
    rofi-wayland
    rofimoji
    rofi-calc
  ];

  home-manager.users.${user} = {
    home.file = {
      # default config for rofi
      # ".config/rofi/config.rasi" = {
      #   source = ./config/config.rasi;
      # };

      ".config/rofi/spotlight.rasi" = {
        source = ./config/spotlight.rasi;
      };

      ".config/rofi/spotlight-hidden-search.rasi" = {
        source = ./config/spotlight-hidden-search.rasi;
      };

      #default theme for rofi (spotlight dark)
      ".config/rofi/themes/spotlight-dark.rasi" = {
        source = ./config/themes/spotlight-dark.rasi;
      };
    };

    programs.rofi = {
      enable = true;
      # font = "FiraCode NF 12";
      theme = "spotlight-dark";
      plugins = [
        pkgs.rofimoji
        pkgs.rofi-calc
        # pkgs.rofi-power-menu
      ];

      extraConfig = {
        modi = "drun,run,calc";
        show-icons = true;
        sort = true;
        matching = "fuzzy";
        display-drun = "";
        display-run = "";
        drun-display-format = "{name}";
      };
    };

  };
}
