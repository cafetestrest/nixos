{ config, pkgs, ... }:

{
  imports =
    [
      #gnome
      ./dconf-settings.nix
      ./keyboard-shortcuts.nix
      ./autostart/copyq.nix
      ./packages.nix

      #unused
      # ./autostart/albert.nix
      # ./autostart/xpad.nix
    ];
}
