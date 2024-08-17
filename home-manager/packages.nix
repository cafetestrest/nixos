{ config, pkgs, ... }:

{
  home.packages = with pkgs; [
    wget
    unzip
    # anydesk
    # nixpkgs-fmt        #Nix code formatter for nixpkgs
    # tldr
    # firefox             #firefox browser
    # libsForQt5.qt5ct
    #wl-clipboard
    # albert              #keybinding for albert toggle to get programs search
    # qbittorrent         #torrent application
    # librewolf           #firefox browser
    # unstable.zed-editor
    # unstable.gpt4all
  ];

  programs = {
    htop = {
      enable = true;
    };

    jq = {
      enable = true;
    };
  };
}
