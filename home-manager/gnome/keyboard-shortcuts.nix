{ config, pkgs, ... }:

{
  dconf.settings = {
    "org/gnome/desktop/wm/keybindings" = {
      close = "['<Alt>F4', '<Super>q']";
    };
    "org/gnome/settings-daemon/plugins/media-keys" = {
      custom-keybindings = [
        "/org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/custom0/"
        "/org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/custom1/"
        "/org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/custom2/"
      ];
    };
    "org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/custom0" = {
      binding = "<Control><Alt>t";
      command = "terminator";
      name = "terminator (ctrl + alt + t)";
    };
    "org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/custom1" = {
      binding = "<Super>t";
      command = "terminator";
      name = "terminator (win + t)";
    };
    "org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/custom2" = {
      binding = "<Control>Page_Down";
      command = "terminator";
      name = "Control>Page_Down";
    };
  };
}