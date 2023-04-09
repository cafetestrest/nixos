{ config, pkgs, ... }:

{
  dconf.settings = {
    "org/gnome/shell/extensions/useless-gaps" = {
      gap-size=15;
      no-gap-when-maximized=true;
    };
  };
}
