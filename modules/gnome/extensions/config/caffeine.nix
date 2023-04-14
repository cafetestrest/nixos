{ config, pkgs, ... }:

{
  dconf.settings = {
    "org/gnome/shell/extensions/caffeine" = {
      enable-fullscreen = false;
      indicator-position-max=3;
      nightlight-control="never";
      toggle-shortcut=["<Alt>c"];
    };
  };
}
