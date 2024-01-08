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
      ./ags.nix # https://github.com/Aylur/ags
      ./hyprland.nix # https://github.com/Aylur/ags

# todo add these?
      # ./gnome/config/terminator.nix
      # ./gnome/config/xterm.nix
      # ./gdm/dconf-settings.nix
      # ./gdm/gtk.nix
    ];
}
