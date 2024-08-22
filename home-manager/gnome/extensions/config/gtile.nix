{ config, pkgs, ... }:

{
  home.packages = with pkgs; [
    gnomeExtensions.gtile
  ];

  dconf.settings = {
    "org/gnome/shell/extensions/gtile" = {
      show-icon=false;
      theme="Default";
    };
  };
}
