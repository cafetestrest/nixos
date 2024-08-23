{ config, lib, vars, ... }:

with lib;

let
  cfg = config.module.desktop-environment.gnome.auto-login;
in
{
  options = {
    module.desktop-environment.gnome.auto-login.enable = mkEnableOption "Enables GNOME automatic login";
  };

  config = mkIf cfg.enable {
    services.xserver.displayManager.autoLogin.enable = true;  # Enable automatic login for the user.
    services.xserver.displayManager.autoLogin.user = "${vars.user}";

    systemd.services."getty@tty1".enable = false; # Workaround for GNOME autologin: https://github.com/NixOS/nixpkgs/issues/103746#issuecomment-945091229
    systemd.services."autovt@tty1".enable = false;
  };
}
