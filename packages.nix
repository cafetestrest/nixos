{ config, pkgs, ... }:

let
  inherit (import ./variables.nix)
  user;
in
{
  # Define a user account. Don't forget to set a password with ‘passwd’.
  users.users.${user} = {
    packages = with pkgs; [
      firefox             #firefox browser
      #thunderbird
      chromium            #chromium browser
      vscodium            #vscode alternative
      xpad                #sticky notes
      copyq               #copy/paste things
      #greenclip - maybe as an alternative (research: https://github.dev/sagikazarmark/nix-config/blob/main/flake.nix)
      #wl-clipboard - maybe as well?
      albert              #keybinding for albert toggle to get programs search
      oh-my-fish          #fish extensions (plugins: z, peco, vcs) (themes: default)
      postman             #postman for API calls
      #jetbrains.phpstorm #phpstorm PHP editor
      qbittorrent         #torrent application
      playerctl           #keyboard shortcuts for play/pause/previous/next track/volume control
      notify-desktop      #notifications from terminal
    ];
  };

  # List packages installed in system profile. To search, run:
  # $ nix search wget
  environment.systemPackages = with pkgs; [
    vim # Do not forget to add an editor to edit configuration.nix! The Nano editor is also installed by default.
    wget
    terminator                #terminal
    git
    htop
    neofetch
    fish
    docker
    docker-compose
    killall
    sassc                     #for building orchid theme
    peco                      #for oh-my-fish (along with omf plugin)
    unzip
    #teamviewer
  ];
  
  #services.teamviewer.enable = true;
}
