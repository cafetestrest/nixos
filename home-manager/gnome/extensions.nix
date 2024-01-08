{ config, pkgs, ... }:

{
  imports =
    [
      #gnome extensions dconf configuration
      ./gnome/extensions/config/blur-my-shell.nix
      ./gnome/extensions/config/caffeine.nix
      ./gnome/extensions/config/dash-to-panel.nix
      ./gnome/extensions/config/executor.nix
      ./gnome/extensions/config/gtile.nix
      #./gnome/extensions/config/super-key.nix
      ./gnome/extensions/config/useless-gaps.nix
    ];

  home.packages = with pkgs; [
    gnomeExtensions.user-themes
    gnomeExtensions.dash-to-panel
    gnomeExtensions.caffeine
    gnomeExtensions.blur-my-shell
    gnomeExtensions.executor
    gnomeExtensions.fuzzy-app-search
    gnomeExtensions.gsconnect
    gnomeExtensions.gtile
    gnomeExtensions.no-overview
    gnomeExtensions.openweather
    gnomeExtensions.rounded-window-corners
    #gnomeExtensions.super-key
    gnomeExtensions.useless-gaps
    gnomeExtensions.workspace-indicator
    gnomeExtensions.tray-icons-reloaded
  ];

  dconf.settings = {
    "org/gnome/shell" = {
      disable-user-extensions = false;
      enabled-extensions = [
        "user-theme@gnome-shell-extensions.gcampax.github.com"
        "workspace-indicator@gnome-shell-extensions.gcampax.github.com"
        "trayIconsReloaded@selfmade.pl"
        "rounded-window-corners@yilozt"
        "openweather-extension@jenslody.de"
        "no-overview@fthx"
        "gTile@vibou"
        "gsconnect@andyholmes.github.io"
        "gnome-fuzzy-app-search@gnome-shell-extensions.Czarlie.gitlab.com"
        "executor@raujonas.github.io"
        "dash-to-panel@jderose9.github.com"
        "caffeine@patapon.info"
        "blur-my-shell@aunetx"
        #"super-key@tommimon.github.com"
        "useless-gaps@pimsnel.com"
        #"pop-shell@system76.com"
      ];
    };
  };
}
