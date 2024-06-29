{ config, pkgs, ... }:

{
  imports =
    [
      #gnome extensions dconf configuration
      ./extensions/config/blur-my-shell.nix
      ./extensions/config/caffeine.nix
      ./extensions/config/dash-to-panel.nix
      ./extensions/config/executor.nix
      ./extensions/config/gtile.nix
      #./extensions/config/super-key.nix
      ./extensions/config/useless-gaps.nix
      ./extensions/config/mediacontrols.nix
      ./extensions/config/tiling-assistant.nix
      ./extensions/config/pop-shell.nix
    ];

  home.packages = with pkgs; [
    gnomeExtensions.user-themes
    gnomeExtensions.no-overview
    # gnomeExtensions.gtile
    gnomeExtensions.gsconnect
    unstable.gnomeExtensions.fuzzy-app-search   #for new gnome versions
    gnomeExtensions.executor
    gnomeExtensions.caffeine
    gnomeExtensions.blur-my-shell
    gnomeExtensions.dash-to-panel
    gnomeExtensions.appindicator
    gnomeExtensions.media-controls
    gnomeExtensions.tiling-assistant
    gnomeExtensions.pop-shell
    # gnomeExtensions.workspace-indicator
    # gnomeExtensions.openweather               #using this, not yet on nix: https://extensions.gnome.org/extension/6655/openweather/
    # gnomeExtensions.rounded-window-corners    #missing in gnome 45
    # gnomeExtensions.super-key                 #not using
    # gnomeExtensions.useless-gaps              #missing in gnome 45
    # gnomeExtensions.tray-icons-reloaded       #not working on wayland, using gnomeExtensions.appindicator
  ];

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
    };
  };
}
