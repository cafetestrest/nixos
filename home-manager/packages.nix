{ config, pkgs, ... }:

{
  home.packages = with pkgs; [
    wget
    unzip
    killall
    # anydesk
    # nixpkgs-fmt        #Nix code formatter for nixpkgs
    # tldr
    # firefox             #firefox browser
    # libsForQt5.qt5ct
    #wl-clipboard
    # albert              #keybinding for albert toggle to get programs search
    # qbittorrent         #torrent application
    libnotify             #notifications from terminal
    # librewolf           #firefox browser
    icon-library          #library of icons
    # unstable.zed-editor
    # unstable.gpt4all
  ];

  programs = {
    jq = {
      enable = true;
    };

    htop = {
      enable = true;
    };
  };
}
