{ config, pkgs, ... }:

{
  home.packages = with pkgs; [
    gnomeExtensions.useless-gaps              #missing in gnome 45
  ];

  dconf.settings = {
    "org/gnome/shell/extensions/useless-gaps" = {
      gap-size=15;
      no-gap-when-maximized=true;
    };
  };
}
