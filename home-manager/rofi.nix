{ config, pkgs, ... }:

{
  home.packages = with pkgs; [
    rofi-wayland
    rofimoji
    rofi-calc
  ];

  home.file = {
    # default config for rofi
    ".config/rofi/config.rasi" = {
      source = ../config/rofi/config.rasi;
    };

    ".config/rofi/spotlight.rasi" = {
      source = ../config/rofi/spotlight.rasi;
    };

    ".config/rofi/spotlight-hidden-search.rasi" = {
      source = ../config/rofi/spotlight-hidden-search.rasi;
    };

    #default theme for rofi (spotlight dark)
    ".config/rofi/themes/spotlight-dark.rasi" = {
      source = ../config/rofi/themes/spotlight-dark.rasi;
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
}
