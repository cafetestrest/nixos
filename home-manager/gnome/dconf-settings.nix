{ config, pkgs, ... }:

{
  dconf.settings = {
    "org/gnome/shell" = {
      favorite-apps = [
        "terminator.desktop"
        "chromium-browser.desktop"
        "org.gnome.Nautilus.desktop"
        "org.gnome.TextEditor.desktop"
      ];
    };
  };
}