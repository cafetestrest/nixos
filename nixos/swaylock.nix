{ config, lib, pkgs, ... }:

with lib;

let
  cfg = config.module.screen-locker.swaylock;
in
{
  options = {
    module.screen-locker.swaylock.enable = mkEnableOption "Enables Swaylock Screen locker";
  };

  config = mkIf cfg.enable {
    environment.systemPackages = with pkgs; [
      swaylock-effects
    ];

    security.pam.services.swaylock = {
      text = ''
      auth include login
      '';
    };
  };
}
