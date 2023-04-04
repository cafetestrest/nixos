{ config, pkgs, ... }:

let
  inherit (import ./variables.nix)
  user
  username
  homeDirectory;
in
{
  imports =
    [
      ./home-manager/gnome/config/terminator.nix
      ./home-manager/gnome/config/fish.nix
      ./home-manager/gnome/keyboard-shortcuts.nix
      ./home-manager/gnome/dconf-settings.nix
      ./home-manager/gnome/autostart/albert.nix
      ./home-manager/gnome/autostart/xpad.nix
      ./home-manager/gnome/autostart/copyq.nix
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
    #killall
    #btop
  ];

}
