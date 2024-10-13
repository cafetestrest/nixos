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
          "user-theme@gnome-shell-extensions.gcampax.github.com"
          "no-overview@fthx"
          # "gTile@vibou"
          "gsconnect@andyholmes.github.io"
          "gnome-fuzzy-app-search@gnome-shell-extensions.Czarlie.gitlab.com"
          "executor@raujonas.github.io"
          "caffeine@patapon.info"
          "blur-my-shell@aunetx"
          "dash-to-panel@jderose9.github.com"
          "appindicatorsupport@rgcjonas.gmail.com"
          # "openweather-extension@penguin-teal.github.io"
          "mediacontrols@cliffniff.github.com"
          "tiling-assistant@leleat-on-github"
          # "workspace-indicator@gnome-shell-extensions.gcampax.github.com"
          # "trayIconsReloaded@selfmade.pl"
          # "rounded-window-corners@yilozt"
          # "openweather-extension@jenslody.de"
          #"super-key@tommimon.github.com"
          # "useless-gaps@pimsnel.com"
          "pop-shell@system76.com"
          # "sound-percentage@maestroschan.fr"
        ];

        # # Enable on Gnome 47+
        # enabled-extensions = [
        #   "ding@rastersoft.com"
        #   "ubuntu-dock@ubuntu.com"
        #   "tiling-assistant@ubuntu.com"
        #   "blur-my-shell@aunetx"
        #   "caffeine@patapon.info"
        #   "dash-to-panel@jderose9.github.com"
        #   "gnome-fuzzy-app-search@gnome-shell-extensions.Czarlie.gitlab.com"
        #   "mediacontrols@cliffniff.github.com"
        #   "no-overview@fthx"
        #   "weatherornot@somepaulo.github.io"
        #   "rounded-window-corners@fxgn"
        #   "useless-gaps@pimsnel.com"
        #   "sound-percentage@subashghimire.info.np"
        #   "Bluetooth-Battery-Meter@maniacx.github.com"
        #   # "executor@raujonas.github.io"
        # ];
      };
    };
  };
}
