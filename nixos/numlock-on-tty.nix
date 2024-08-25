{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.services.numlock-on-tty;
in
{
  options = {
    module.services.numlock-on-tty.enable = mkEnableOption "Enables numlock on TTY";
  };

  config = mkIf cfg.enable {
    systemd.services.numLockOnTty = {
      wantedBy = [ "multi-user.target" ];
      serviceConfig = {
        # /run/current-system/sw/bin/setleds -D +num < "$tty";
        ExecStart = lib.mkForce (pkgs.writeShellScript "numLockOnTty" ''
          for tty in /dev/tty{1..6}; do
              ${pkgs.kbd}/bin/setleds -D +num < "$tty";
          done
        '');
      };
    };
  };
}
