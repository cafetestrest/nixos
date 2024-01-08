{ config, pkgs, ... }:

{
  # List packages installed in system profile. To search, run:
  # $ nix search wget
  environment.systemPackages = with pkgs; [
    vim # Do not forget to add an editor to edit configuration.nix! The Nano editor is also installed by default.
    wget
    terminator            #terminal
    git
    htop
    neofetch
    killall
    unzip
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
    # baobab
    apple-cursor
  ];

  # services.teamviewer.enable = true;
}
