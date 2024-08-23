{ config, pkgs, lib, vars, ... }:

with lib;

let
  cfg = config.module.shell.fish;
in
{
  options = {
    module.shell.fish.enable = mkEnableOption "Enables fish shell";
  };

  config = mkIf cfg.enable {
    users.users.${vars.user} = {
      shell = pkgs.fish;
    };

    programs.fish = {
      enable = true;
    };
  };
}
