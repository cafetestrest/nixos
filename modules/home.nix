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
      ./gdm/dconf-settings.nix

      #gnome
      # ./gnome/keyboard-shortcuts.nix
      # ./gnome/autostart/copyq.nix

      #unused
      # ./gnome/dconf-settings.nix
      # ./gnome/config/albert.nix
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

  # gtk = {
  #   enable = true;
  #   font = {
  #     name = "Cantarell 11";
  #   };
  #   theme = {
  #     name = "Adwaita-Dark";
  #     # package = pkgs.themename;
  #   };
  #   cursorTheme = {
  #     name = "macOS-Monterey";
  #     package = pkgs.apple-cursor;
  #   };
  #   # iconTheme = {
  #     # name = "Adwaita";
  #     # package = pkgs-iconname;
  #   # };
  # };
}
