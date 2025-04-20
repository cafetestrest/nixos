{ config, lib, pkgs, vars, ... }:

with lib;

let
  cfg = config.module.programs.openrazer;
in
{
  options = {
    module.programs.openrazer.enable = mkEnableOption "Enables razer devices support";
  };

  config = mkIf cfg.enable {
    hardware.openrazer.enable = true;

    environment.systemPackages = with pkgs; [
      openrazer-daemon
      polychromatic
    ];

    users.users.${vars.user} = {
      extraGroups = [
        "openrazer"
      ];
    };
  };
}
