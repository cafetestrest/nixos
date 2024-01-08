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
      ./swaylock.nix
      # ./ags.nix # https://github.com/Aylur/ags
      # ../hyprland.nix # https://github.com/Aylur/ags

# todo add these?
      # ./gnome/config/terminator.nix
      # ./gnome/config/xterm.nix
      # ./gdm/dconf-settings.nix
      # ./gdm/gtk.nix

      #gnome
      # ./gnome/keyboard-shortcuts.nix
      # ./gnome/autostart/copyq.nix

      #unused
      # ./gnome/dconf-settings.nix
      # ./gnome/config/albert.nix
      # ./gnome/autostart/albert.nix
      # ./gnome/autostart/xpad.nix
    ];
}
