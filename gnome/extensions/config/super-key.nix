{ config, pkgs, ... }:

{
  dconf.settings = {
    "org/gnome/shell/extensions/super-key" = {
      overlay-key-action = "albert toggle";
    };
  };
}
