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
    "org/gnome/desktop/wm/keybindings" = {
      close = "['<Super>q','<Alt>F4']";
      move-to-workspace-up = "@as []";
      move-to-workspace-down = "@as []";
    };
    "org/gnome/shell/keybindings" = {
      toggle-message-tray = "@as []";
    };
    "org/gnome/settings-daemon/plugins/media-keys" = {
      custom-keybindings = [
        "/org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/custom0/"
        "/org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/custom1/"
        "/org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/custom2/"
        "/org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/custom3/"
        "/org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/custom4/"
        "/org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/custom5/"
        "/org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/custom6/"
        "/org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/custom7/"
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
      binding = "<Super>f";
      command = "nautilus";
      name = "nautilus (win + f)";
    };
    "org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/custom3" = {
      binding = "<Super>g";
      command = "gnome-text-editor";
      name = "gnome-text-editor (win + g)";
    };
    "org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/custom4" = {
      binding = "<Super>c";
      command = "chromium";
      name = "chromium (win + c)";
    };
    "org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/custom5" = {
      binding = "<Super>v";
      command = "copyq menu";
      name = "copyq menu (win + v)";
    };
    "org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/custom6" = {
      binding = "<Super>Page_Up";
      command = ''
      sh -c 'wpctl set-default $(wpctl status | grep "Digital Stereo (HDMI" | grep "\d+" -Po | head -n 1) && notify-desktop "Audio Output changed to HDMI"'
      '';
      name = "Audio HDMI (win + pgup)";
    };
    "org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/custom7" = {
      binding = "<Super>Page_Down";
      command = ''
      sh -c 'wpctl set-default $(wpctl status | grep "SteelSeries Arctis 7 Game" | grep "\d+" -Po | head -n 1) && notify-desktop "Audio Output changed to Headset"'
      '';
      name = "Audio HDMI (win + pgup)";
    };
  };
}