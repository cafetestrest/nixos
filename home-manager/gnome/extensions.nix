{ config, pkgs, ... }:

{
  home.packages = with pkgs; [
    gnomeExtensions.user-themes #TODO move to proper extension nix file
    gnomeExtensions.no-overview
    gnomeExtensions.gsconnect
    unstable.gnomeExtensions.fuzzy-app-search   #for new gnome versions
    gnomeExtensions.blur-my-shell
    gnomeExtensions.appindicator
    # gnomeExtensions.workspace-indicator
    # gnomeExtensions.openweather               #using this, not yet on nix: https://extensions.gnome.org/extension/6655/openweather/
    # gnomeExtensions.rounded-window-corners    #missing in gnome 45
    # gnomeExtensions.tray-icons-reloaded       #not working on wayland, using gnomeExtensions.appindicator
  ];

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
}
