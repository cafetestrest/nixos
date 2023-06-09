{ config, pkgs, ... }:

let
  inherit (import ../variables.nix)
    user
    username
    homeDirectory;
in
{
  imports =
    [
      ./gnome/config/terminator.nix
      ./gnome/config/fish.nix
      # ./gnome/config/albert.nix
      ./gnome/keyboard-shortcuts.nix
      ./gnome/dconf-settings.nix
      # ./gnome/autostart/albert.nix
      # ./gnome/autostart/xpad.nix
      ./gnome/autostart/copyq.nix
    ];

  # Home Manager needs a bit of information about you and the
  # paths it should manage.
  home.username = "${username}";
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

  home.packages = with pkgs; [
    # killall
    # btop
  ];

}
