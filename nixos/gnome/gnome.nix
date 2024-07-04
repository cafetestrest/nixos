{ config, pkgs, ... }:

let
  inherit (import ../variables.nix)
    user;
in
{
  services.xserver.desktopManager.gnome.enable = true;  # Enable the GNOME Desktop Environment.

  # services.xserver.displayManager.autoLogin.enable = true;  # Enable automatic login for the user.
  # services.xserver.displayManager.autoLogin.user = "${user}";

  # systemd.services."getty@tty1".enable = false; # Workaround for GNOME autologin: https://github.com/NixOS/nixpkgs/issues/103746#issuecomment-945091229
  # systemd.services."autovt@tty1".enable = false;

  # dconf currently enabled under original configuration.nix file
  # programs.dconf.enable = true;
}
