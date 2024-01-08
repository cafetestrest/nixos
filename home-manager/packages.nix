{ config, pkgs, ... }:

{
  home.packages = with pkgs; [
    terminator            #terminal
    neofetch
    killall
    # teamviewer
    # anydesk
    # nixpkgs-fmt        #Nix code formatter for nixpkgs
    # tldr
    distrobox             #distibutions in docker container
    inotify-tools
    jq                    #json
    pamixer               #audio terminal commands
    bc                    #command line calculator
    # firefox             #firefox browser
    chromium              #chromium browser
    vscodium              #vscode alternative
    copyq                 #copy/paste things
    libsForQt5.qt5ct
    #wl-clipboard
    # albert              #keybinding for albert toggle to get programs search
    # postman             #postman for API calls
    jetbrains.phpstorm    #phpstorm PHP editor
    # qbittorrent         #torrent application
    playerctl             #keyboard shortcuts for play/pause/previous/next track/volume control
    libnotify             #notifications from terminal
    # headsetcontrol      #used to retrieve battery percentage from headset
    # librewolf           #firefox browser
    apple-cursor
  ];

  # services.teamviewer.enable = true;
}