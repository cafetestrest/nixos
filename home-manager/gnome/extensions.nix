{ config, lib, ... }:

with lib;

let
  cfg = config.module.gnome.extension;
in
{
  options = {
    module.gnome.extension.enable = mkEnableOption "Enables Gnome extensions";
  };

  config = mkIf cfg.enable {
    dconf.settings = {  #TODO move to user
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
      };
    };
  };
}
