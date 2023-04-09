{ config, pkgs, ... }:

{
  dconf.settings = {
    "org/gnome/shell/extensions/blur-my-shell/panel" = {
      blur=true;
      brightness=1.0;
      color="(0.0, 0.0, 0.0, 1.0)";
      customize=true;
      override-background=true;
      sigma=0;
      static-blur=true;
      style-panel=2;
    };
  };
}
