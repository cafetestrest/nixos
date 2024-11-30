{ config, lib, ... }:

with lib;

let
  cfg = config.module.gnome.extension.hosts.desktop;
in
{
  options = {
    module.gnome.extension.hosts.desktop.enable = mkEnableOption "Enables Gnome extensions for host desktop";
  };

  config = mkIf cfg.enable {
    dconf.settings = {
      "org/gnome/shell" = {
        disable-user-extensions = false;
        enabled-extensions = [
          "ding@rastersoft.com" # Gnome 47
          "ubuntu-dock@ubuntu.com"  # Gnome 47
          "tiling-assistant@ubuntu.com" #  Gnome 47
          "blur-my-shell@aunetx"
          "caffeine@patapon.info"
          "dash-to-panel@jderose9.github.com"
          "gnome-fuzzy-app-search@gnome-shell-extensions.Czarlie.gitlab.com"
          "mediacontrols@cliffniff.github.com"
          "no-overview@fthx"
          "weatherornot@somepaulo.github.io"
          # "useless-gaps@pimsnel.com"
          "sound-percentage@subashghimire.info.np"
          # "Bluetooth-Battery-Meter@maniacx.github.com"
          # "monitor@astraext.github.io"
          # "executor@raujonas.github.io"
          # "gsconnect@andyholmes.github.io"  # Unused, missing on Gnome 47
          # "gTile@vibou" # Unused
          # "super-key@tommimon.github.com" # Unused
          # "openweather-extension@penguin-teal.github.io"  # Unused
          "system-monitor@gnome-shell-extensions.gcampax.github.com"
          "rounded-window-corners@fxgn"
          "status-icons@gnome-shell-extensions.gcampax.github.com"
          "user-theme@gnome-shell-extensions.gcampax.github.com"
        ];
      };
    };
  };
}
