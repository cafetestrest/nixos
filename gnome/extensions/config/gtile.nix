{ config, pkgs, ... }:

{
  dconf.settings = {
    "org/gnome/shell/extensions/gtile" = {
      show-icon=false;
      theme="Default";
    };
  };
}
