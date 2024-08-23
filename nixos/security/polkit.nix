{ config, lib, inputs, pkgs, ... }:

with lib;

let
  cfg = config.module.security.polkit;
in
{
  options = {
    module.security.polkit.enable = mkEnableOption "Enables polkit";
  };

  config = mkIf cfg.enable {
    security = {
      polkit.enable = true;
      # pam.services.ags = {};
    };

    systemd = {
      user.services.polkit-gnome-authentication-agent-1 = {
        description = "polkit-gnome-authentication-agent-1";
        wantedBy = [ "graphical-session.target" ];
        wants = [ "graphical-session.target" ];
        after = [ "graphical-session.target" ];
        serviceConfig = {
          Type = "simple";
          ExecStart = "${pkgs.polkit_gnome}/libexec/polkit-gnome-authentication-agent-1";
          Restart = "on-failure";
          RestartSec = 1;
          TimeoutStopSec = 10;
        };
      };
    };
  };
}
