{ config, pkgs, ... }:

{
  dconf.settings = {
    "org/gnome/shell/extensions/caffeine" = {
      enable-fullscreen = false;
      indicator-position=0;
      indicator-position-index=0;
      indicator-position-max=4;
      nightlight-control="never";
      show-indicator="always";
      toggle-shortcut=["<Alt>c"];
    };
  };
}
