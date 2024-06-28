{ config, pkgs, ... }:

let
  inherit (import ../variables.nix)
    user
    homeDirectory;
in
{
  imports =
    [
      ./packages.nix
      ./fonts.nix
      # ./chrome.nix
      ./terminator.nix
      # ./xterm.nix
      ./gdm/gtk.nix
      ./scripts # scripts, place to store all common scripts
      ./mpv.nix # mpv video player and its config
      ./fastfetch.nix
      ./vscode.nix
      ./brave.nix
      # ./rooter.nix  #https://github.com/run-as-root/rooter
    ];

  home = {
    sessionVariables = {
      QT_XCB_GL_INTEGRATION = "none"; # kde-connect
    };

    # sessionPath = [
    #   "$HOME/.local/bin"
    # ];
  };

  #KDE Connect
  services = {
    kdeconnect = {
      enable = true;
      indicator = true;
    };
  };

  # Home Manager needs a bit of information about you and the
  # paths it should manage.
  home.username = "${user}";
  home.homeDirectory = "${homeDirectory}";

  # This value determines the Home Manager release that your
  # configuration is compatible with. This helps avoid breakage
  # when a new Home Manager release introduces backwards
  # incompatible changes.
  #
  # You can update Home Manager without changing this value. See
  # the Home Manager release notes for a list of state version
  # changes in each release.
  home.stateVersion = "22.11";

  # Let Home Manager install and manage itself.
  programs.home-manager.enable = true;
}
