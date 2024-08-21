{ config, lib, pkgs, vars, ... }:

with lib;

let
  cfg = config.module.desktop-environment.gnome;
in
{
  options = {
    module.desktop-environment.gnome.enable = mkEnableOption "Enables GNOME DE";
  };

  config = mkIf cfg.enable {
    services.xserver.desktopManager.gnome.enable = true;  # Enable the GNOME Desktop Environment.

    # services.xserver.displayManager.autoLogin.enable = true;  # Enable automatic login for the user.  #TODO add config
    # services.xserver.displayManager.autoLogin.user = "${vars.user}";

    # systemd.services."getty@tty1".enable = false; # Workaround for GNOME autologin: https://github.com/NixOS/nixpkgs/issues/103746#issuecomment-945091229
    # systemd.services."autovt@tty1".enable = false;

    # dconf currently enabled under original configuration.nix file
    # programs.dconf.enable = true;
  };
}
