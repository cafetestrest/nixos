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
      # ./packages.nix
      # ./fonts.nix
      # ./ags.nix # https://github.com/Aylur/ags
      # ./hyprland.nix # https://github.com/Aylur/ags
      # ./terminator.nix
      # ./xterm.nix
      # ./gdm/dconf-settings.nix
      # ./gdm/gtk.nix
      # ./gnome/packages.nix
      # ./scripts.nix # scripts, place to store all common scripts
      # ./mpv.nix # mpv video player and its config
      # ./fish.nix

      #gnome
      # ./gnome/keyboard-shortcuts.nix
      # ./gnome/autostart/copyq.nix

      #unused
      # ./gnome/dconf-settings.nix
      # ../config/albert.nix
      # ./gnome/autostart/albert.nix
      # ./gnome/autostart/xpad.nix
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
