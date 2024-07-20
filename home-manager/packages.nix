{ config, pkgs, ... }:

{
  home.packages = with pkgs; [
    wget
    unzip
    killall
    # anydesk
    # nixpkgs-fmt        #Nix code formatter for nixpkgs
    # tldr
    inotify-tools
    pamixer               #audio terminal commands
    bc                    #command line calculator
    # firefox             #firefox browser
    # libsForQt5.qt5ct
    #wl-clipboard
    # albert              #keybinding for albert toggle to get programs search
    # qbittorrent         #torrent application
    playerctl             #keyboard shortcuts for play/pause/previous/next track/volume control
    libnotify             #notifications from terminal
    # librewolf           #firefox browser
    icon-library          #library of icons
    # unstable.zed-editor
    # unstable.gpt4all
    peco                  #bash/fish better reverse search
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
