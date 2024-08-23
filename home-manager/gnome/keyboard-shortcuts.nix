{ config, lib, ... }:

with lib;

let
  cfg = config.module.gnome.keyboard-shortcuts;
in
{
  options = {
    module.gnome.keyboard-shortcuts.enable = mkEnableOption "Enables GNOME keyboard shortcuts";
  };

  config = mkIf cfg.enable {
    dconf.settings = {
      "org/gnome/desktop/wm/keybindings" = {
        close = [ "<Super>q" "<Alt>F4" ];
        maximize = [ "<Super><Shift>Up" ];
        toggle-maximized = [ "<Super>Up" ];
        switch-input-source = [ ];
        switch-input-source-backward = [ ];
        toggle-fullscreen = [ "<Super><Shift>F11" ];
        move-to-workspace-up = [ ];
        move-to-workspace-down = [ ];
        move-to-workspace-left = [ ];
        move-to-workspace-right = [ ];
        switch-to-workspace-left = [ ];
        switch-to-workspace-right = [ ];
        begin-move = [ "<Super>backslash" ];
        begin-resize = [ "<Super><Shift>backslash" ];
      };

      "org/gnome/shell/keybindings" = {
        toggle-message-tray = [ ];
        toggle-overview = [ "<Super>space" ];
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
          # "/org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/custom8/"
        ];
      };
      "org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/custom0" = {
        binding = "<Control><Alt>t";
        command = "kitty";
        name = "kitty (ctrl + alt + t)";
      };
      "org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/custom1" = {
        binding = "<Super>t";
        command = "kitty";
        name = "kitty (win + t)";
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
        command = "brave";
        name = "brave (win + c)";
      };
      "org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/custom5" = {
        binding = "<Super>v";
        command = "copyq menu";
        name = "copyq menu (win + v)";
      };
      "org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/custom6" = {
        binding = "<Super>Page_Up";
        command = ''
          sh -c 'wpctl set-default $(wpctl status | grep "Digital Stereo (HDMI" | grep "\d+" -Po | head -n 1) && notify-send "Audio Output changed to HDMI"'
        '';
        name = "Audio HDMI (win + pgup)";
      };
      "org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/custom7" = {
        binding = "<Super>Page_Down";
        command = ''
          sh -c 'wpctl set-default $(wpctl status | grep "SteelSeries Arctis 7 Game" | grep "\d+" -Po | head -n 1) && notify-send "Audio Output changed to Headset"'
        '';
        name = "Audio HDMI (win + pgup)";
      };
      # "org/gnome/settings-daemon/plugins/media-keys/custom-keybindings/custom8" = {
      #   binding = "<Super>space";
      #   command = "albert toggle";
      #   name = "albert toggle (win + space)";
      # };
    };
  };
}
