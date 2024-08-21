{ config, pkgs, lib, vars, ... }:

with lib;

let
  cfg = config.module.shell.default-fish;
in
{
  options = {
    module.shell.default-fish.enable = mkEnableOption "Enables fish shell as sets it as default";
  };

  config = mkIf cfg.enable {
    # users.defaultUserShell = pkgs.fish;

    users.users.${vars.user} = {
      shell = pkgs.fish;
      useDefaultShell = true;
    };

    programs.fish = {
      enable = true;
    };
  };
}
