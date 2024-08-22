{ config, pkgs, ... }:

{
  imports =
    [
      #gnome
      ./keyboard-shortcuts.nix
      # ./autostart/copyq.nix
      ./packages.nix

      #unused
      # ./autostart/albert.nix
      # ./autostart/xpad.nix
    ];
}
